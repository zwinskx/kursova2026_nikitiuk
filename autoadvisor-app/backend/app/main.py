from fastapi import FastAPI, Depends, HTTPException, status # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import random
from .database import engine, Base, get_db
from .models import User, Car, Review, Booking
from .decision_tree import evaluate_car_liquidity
from .mailer import send_email_alert, send_reset_code_email # Імпорт вашої реальної розсилки

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AutoAdvisor Production API", version="6.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db():
    db = next(get_db())
    
    # Створення адміна за замовчуванням
    admin_exists = db.query(User).filter(User.email == "sasha342008@gmail.com").first()
    if not admin_exists:
        admin_user = User(
            email="sasha342008@gmail.com",
            password="sn342008",
            display_name="Sasha Admin",
            is_admin=True
        )
        db.add(admin_user)

    # Автозаповнення машин із фотографіями для розділів Discover / Overview
    if db.query(Car).count() == 0:
        initial_cars = [
            Car(brand="BMW", model="330i M Sport", year=2022, body_type="Sedan", transmission="Automatic", mileage=24180, price=38450, badge="BEST MATCH", image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"),
            Car(brand="Mercedes-Benz", model="C300", year=2023, body_type="Sedan", transmission="Automatic", mileage=18820, price=41290, badge="High liquidity", image_url="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"),
            Car(brand="Mercedes-AMG", model="C43", year=2021, body_type="Coupe", transmission="Automatic", mileage=31450, price=46800, badge="High liquidity", image_url="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80")
        ]
        db.add_all(initial_cars)

    # Автозаповнення відгуків
    if db.query(Review).count() == 0:
        default_revs = [
            Review(author="Денис М.", comment="Саме те, що я шукав для щоденної роботи. Швидко, охайно й без зайвих складнощів.", rating=5),
            Review(author="Софія Р.", comment="Загалом чудовий досвід. Особливо сподобалося, як легко знайти потрібну інформацію.", rating=5),
            Review(author="Тарас В.", comment="Хороший старт і зрозумілий інтерфейс. Є кілька дрібниць, які ще можна вдосконалити.", rating=4)
        ]
        db.add_all(default_revs)
        
    db.commit()
    db.close()

# Тимчасове сховище кодів відновлення пароля в пам'яті (email -> код)
reset_codes_db = {}

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    display_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

class PreferencesUpdate(BaseModel):
    display_name: str
    email_alerts: bool
    delivery_frequency: str
    min_liquidity: int
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    body_type: str
    transmission: str
    mileage: int
    price: float
    engine_volume: Optional[str] = "2.0L"
    custom_liquidity: Optional[int] = None
    badge: Optional[str] = "AI RECOMMEND"
    image_url: str
    description: Optional[str] = "Опис відсутній"

class ReviewCreate(BaseModel):
    author: str
    comment: str
    rating: int = 5

class BookingCreate(BaseModel):
    user_email: str
    car_id: int
    phone: str
    comment: Optional[str] = ""

@app.post("/api/register")
def register_user(data: UserRegister, db: Session = Depends(get_db)):
    if data.email == "sasha342008@gmail.com":
        raise HTTPException(status_code=400, detail="Ця пошта зарезервована для адміністратора.")
    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Пароль має містити мінімум 8 символів.")
    
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Користувач із таким email вже існує.")
    
    new_user = User(email=data.email, password=data.password, display_name=data.display_name, is_admin=False)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Успішна реєстрація!", "user_id": new_user.id, "is_admin": False, "display_name": new_user.display_name}

@app.post("/api/login")
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email, User.password == data.password).first()
    if not user:
        raise HTTPException(status_code=401, detail="Невірний email або пароль.")
    return {"message": "Вхід успішний!", "user_id": user.id, "is_admin": user.is_admin, "display_name": user.display_name, "email": user.email}

@app.post("/api/auth/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача з такою поштою не знайдено.")
    
    code = str(random.randint(100000, 999999))
    reset_codes_db[data.email] = code
    
    try:
        send_reset_code_email(to_email=data.email, title="Код відновлення пароля", code=code)
    except Exception:
        pass
        
    return {"message": f"Код підтвердження успішно надіслано на пошту {data.email}!"}

@app.post("/api/auth/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    stored_code = reset_codes_db.get(data.email)
    if not stored_code or stored_code != data.code:
        raise HTTPException(status_code=400, detail="Невірний або прострочений код підтвердження.")
    
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Пароль має містити мінімум 8 символів.")
        
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено.")
        
    user.password = data.new_password
    db.commit()
    del reset_codes_db[data.email]
    
    return {"message": "Пароль успішно змінено!"}

@app.put("/api/user/{user_id}/preferences")
def update_preferences(user_id: int, data: PreferencesUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено.")
    
    if data.current_password and data.new_password:
        if user.password != data.current_password:
            raise HTTPException(status_code=400, detail="Поточний пароль вказано невірно.")
        if len(data.new_password) < 8:
            raise HTTPException(status_code=400, detail="Новий пароль має містити мінімум 8 символів.")
        user.password = data.new_password

    user.display_name = data.display_name
    user.email_alerts = data.email_alerts
    user.delivery_frequency = data.delivery_frequency
    user.min_liquidity = data.min_liquidity
    db.commit()
    
    return {"message": "Налаштування успішно збережено!"}

@app.get("/api/recommendations")
def get_recommendations(
    budget_max: float = 150000, 
    brand: str = "All", 
    body_type: str = "Any", 
    transmission: str = "Any", 
    min_liquidity: int = 0, 
    db: Session = Depends(get_db)
):
    query = db.query(Car)
    if budget_max:
        query = query.filter(Car.price <= budget_max)
    if brand != "All":
        query = query.filter(Car.brand == brand)
    if body_type != "Any":
        query = query.filter(Car.body_type == body_type)
    if transmission != "Any":
        query = query.filter(Car.transmission == transmission)

    cars = query.all()
    result = []
    for car in cars:
        metrics = evaluate_car_liquidity(car.mileage, car.year, car.brand)
        score = car.custom_liquidity if car.custom_liquidity is not None else metrics["liquidity_score"]
        
        if score >= min_liquidity:
            result.append({
                "id": car.id, 
                "title": f"{car.brand} {car.model}", 
                "price": car.price,
                "year": car.year, 
                "mileage": f"{car.mileage:,} mi", 
                "mileage_raw": car.mileage,
                "body_type": car.body_type,
                "transmission": car.transmission, 
                "badge": car.badge, 
                "image_url": car.image_url,
                "liquidity_score": score, 
                "liquidity_status": metrics["liquidity_status"]
            })
    return result

@app.post("/api/admin/cars")
def add_car(car_data: CarCreate, db: Session = Depends(get_db)):
    new_car = Car(
        brand=car_data.brand,
        model=car_data.model,
        year=car_data.year,
        body_type=car_data.body_type,
        transmission=car_data.transmission,
        mileage=car_data.mileage,
        price=car_data.price,
        engine_volume=car_data.engine_volume,
        custom_liquidity=car_data.custom_liquidity,
        badge=car_data.badge or "AI RECOMMEND",
        image_url=car_data.image_url,
        description=car_data.description
    )
    db.add(new_car)
    db.commit()
    
    metrics = evaluate_car_liquidity(car_data.mileage, car_data.year, car_data.brand)
    score = car_data.custom_liquidity if car_data.custom_liquidity is not None else metrics["liquidity_score"]
    
    subscribers = db.query(User).filter(User.email_alerts == True).all()
    for user in subscribers:
        if score >= user.min_liquidity:
            try:
                send_email_alert(
                    to_email=user.email,
                    car_title=f"{car_data.brand} {car_data.model}",
                    price=car_data.price
                )
            except Exception:
                pass

    return {"message": "Авто успішно додано в MySQL, розсилку на реальні пошти виконано!"}

@app.delete("/api/admin/cars/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if car:
        db.delete(car)
        db.commit()
    return {"message": "Видалено з бази."}

@app.get("/api/bookings")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return [{
        "id": b.id,
        "user_email": b.user_email,
        "car_id": b.car_id,
        "phone": b.phone,
        "comment": b.comment,
        "status": b.status
    } for b in bookings]

@app.post("/api/bookings")
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    new_booking = Booking(
        user_email=data.user_email,
        car_id=data.car_id,
        phone=data.phone,
        comment=data.comment,
        status="pending"
    )
    db.add(new_booking)
    db.commit()
    return {"message": "Бронювання успішно створено!"}

@app.put("/api/admin/bookings/{booking_id}")
def update_booking_status(booking_id: int, status_data: dict, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Бронювання не знайдено")
    booking.status = status_data.get("status", booking.status)
    db.commit()
    return {"message": "Статус бронювання оновлено!"}

@app.delete("/api/admin/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        db.delete(booking)
        db.commit()
    return {"message": "Бронювання видалено з бази."}

@app.get("/api/reviews")
def get_reviews(db: Session = Depends(get_db)):
    return db.query(Review).all()

@app.post("/api/reviews")
def add_review(data: ReviewCreate, db: Session = Depends(get_db)):
    new_rev = Review(**data.dict())
    db.add(new_rev)
    db.commit()
    return {"message": "Відгук додано!"}