from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import random
import time
import secrets
from .database import engine, Base, get_db
from .models import User, Car, Review, Booking, ForumMessage
from .decision_tree import evaluate_car_liquidity
from .mailer import send_email_alert, send_reset_code_email
from typing import Optional
from pydantic import BaseModel
from app import database

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AutoAdvisor Production API", version="6.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def user_payload(user, message: str):
    """Єдина відповідь для login/register: з email і всіма налаштуваннями розсилки."""
    return {
        "message": message,
        "user_id": user.id,
        "email": user.email,
        "is_admin": user.is_admin,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
        "email_alerts": user.email_alerts if user.email_alerts is not None else True,
        "delivery_frequency": user.delivery_frequency or "Daily digest",
        "min_liquidity": user.min_liquidity if user.min_liquidity is not None else 85,
    }

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

def check_reset_code(email: str, code: str):
    entry = reset_codes_db.get(email)
    if not entry or time.time() > entry["expires"]:
        reset_codes_db.pop(email, None)
        raise HTTPException(status_code=400, detail="Код прострочений. Запросіть новий.")

    if entry["attempts"] >= MAX_RESET_ATTEMPTS:
        reset_codes_db.pop(email, None)
        raise HTTPException(status_code=429, detail="Забагато спроб. Запросіть новий код.")

    if not secrets.compare_digest(entry["code"], code.strip()):
        entry["attempts"] += 1
        raise HTTPException(status_code=400, detail="Невірний код підтвердження.")

@app.post("/api/auth/verify-code")
def verify_code(data: VerifyCodeRequest):
    check_reset_code(data.email, data.code)
    return {"message": "Код підтверджено."}

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
            Car(brand="BMW", model="330i M Sport", year=2022, body_type="Sedan", transmission="Automatic", mileage=24180, price=38450, badge="BEST MATCH", image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80", description="Динамічний преміум седан із чудовою керованістю та спортивним характером."),
            Car(brand="Mercedes-Benz", model="C300", year=2023, body_type="Sedan", transmission="Automatic", mileage=18820, price=41290, badge="High liquidity", image_url="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80", description="Комфортабельний німецький автомобіль з розкішним салоном та високою ліквідністю."),
            Car(brand="Mercedes-AMG", model="C43", year=2021, body_type="Coupe", transmission="Automatic", mileage=31450, price=46800, badge="High liquidity", image_url="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", description="Спортивне купе для справжніх цінителів драйву та потужності.")
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

# Коди скидання пароля: email -> {"code", "expires", "attempts"}
RESET_CODE_TTL = 10 * 60   # 10 хвилин
MAX_RESET_ATTEMPTS = 5
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
    avatar_url: Optional[str] = None
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

class CarUpdateModel(BaseModel):
    title: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    body_type: Optional[str] = None
    transmission: Optional[str] = None
    mileage: Optional[int] = None
    price: Optional[float] = None
    engine_volume: Optional[str] = None
    custom_liquidity: Optional[int] = None
    badge: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None

class ReviewCreate(BaseModel):
    author: str
    comment: str
    rating: int = 5

class BookingCreate(BaseModel):
    user_email: str
    car_id: int
    phone: str
    comment: Optional[str] = ""

class ForumCreate(BaseModel):
    email: str
    message: str
    parent_id: Optional[int] = None
    # author і avatar_url фронтенд теж надсилає, але сервер бере їх з БД
    author: Optional[str] = None
    avatar_url: Optional[str] = None

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
    return user_payload(new_user, "Успішна реєстрація!")

@app.post("/api/login")
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email, User.password == data.password).first()
    if not user:
        raise HTTPException(status_code=401, detail="Невірний email або пароль.")
    return user_payload(user, "Вхід успішний!")

@app.post("/api/auth/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача з такою поштою не знайдено.")
    
    code = f"{secrets.randbelow(900000) + 100000}"
    reset_codes_db[data.email] = {
        "code": code,
        "expires": time.time() + RESET_CODE_TTL,
        "attempts": 0,
    }
    
    try:
        send_reset_code_email(to_email=data.email, title="Код відновлення пароля", code=code)
    except Exception:
        pass
        
    return {"message": f"Код підтвердження успішно надіслано на пошту {data.email}!"}

@app.post("/api/auth/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    check_reset_code(data.email, data.code)

    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Пароль має містити мінімум 8 символів.")

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено.")

    user.password = data.new_password
    db.commit()
    reset_codes_db.pop(data.email, None)

    return {"message": "Пароль успішно змінено!"}

@app.put("/api/user/{user_id}/preferences")
def update_preferences(
    user_id: int,
    data: PreferencesUpdate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Користувача не знайдено."
        )

    # Перевірка зміни пароля
    if data.current_password and data.new_password:
        if user.password != data.current_password:
            raise HTTPException(
                status_code=400,
                detail="Поточний пароль вказано невірно."
            )

        if len(data.new_password) < 8:
            raise HTTPException(
                status_code=400,
                detail="Новий пароль має містити мінімум 8 символів."
            )

        user.password = data.new_password

    # Оновлення інформації користувача
    user.display_name = data.display_name
    user.email_alerts = data.email_alerts
    user.delivery_frequency = data.delivery_frequency
    user.min_liquidity = data.min_liquidity

    # ЗБЕРЕЖЕННЯ ФОТО ПРОФІЛЮ
    user.avatar_url = data.avatar_url

    db.commit()
    db.refresh(user)

    return {
        "message": "Налаштування успішно збережено!",
        "user": {
            "id": user.id,
            "email": user.email,
            "display_name": user.display_name,
            "avatar_url": user.avatar_url,
            "email_alerts": user.email_alerts,
            "delivery_frequency": user.delivery_frequency,
            "min_liquidity": user.min_liquidity
        }
    }

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
                "brand": car.brand,
                "model": car.model,
                "price": car.price,
                "year": car.year, 
                "mileage": f"{car.mileage:,} mi", 
                "mileage_raw": car.mileage,
                "body_type": car.body_type,
                "transmission": car.transmission, 
                "engine_volume": car.engine_volume,
                "badge": car.badge, 
                "image_url": car.image_url,
                "description": car.description,
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
        if score >= (user.min_liquidity or 0):
            try:
                send_email_alert(
                    to_email=user.email,
                    car_title=f"{car_data.brand} {car_data.model}",
                    price=car_data.price
                )
            except Exception:
                pass

    return {"message": "Авто успішно додано в MySQL, розсилку на реальні пошти виконано!"}

@app.put("/api/admin/cars/{car_id}")
def update_car(car_id: int, car_data: CarUpdateModel, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Автомобіль не знайдено.")
    
    if car_data.brand is not None: car.brand = car_data.brand
    if car_data.model is not None: car.model = car_data.model
    if car_data.year is not None: car.year = car_data.year
    if car_data.body_type is not None: car.body_type = car_data.body_type
    if car_data.transmission is not None: car.transmission = car_data.transmission
    if car_data.mileage is not None: car.mileage = car_data.mileage
    if car_data.price is not None: car.price = car_data.price
    if car_data.engine_volume is not None: car.engine_volume = car_data.engine_volume
    if car_data.custom_liquidity is not None: car.custom_liquidity = car_data.custom_liquidity
    if car_data.badge is not None: car.badge = car_data.badge
    if car_data.image_url is not None: car.image_url = car_data.image_url
    if car_data.description is not None: 
        car.description = car_data.description  # Гарантоване оновлення опису в базі даних


    db.commit()
    db.refresh(car)
    return {"message": "Автомобіль успішно оновлено!"}

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


# ===================== ФОРУМ =====================

@app.get("/api/forum")
def get_forum(db: Session = Depends(get_db)):
    msgs = db.query(ForumMessage).order_by(ForumMessage.created_at.asc()).all()

    # Аватарки беремо з таблиці користувачів, щоб не зберігати base64 у кожному повідомленні
    emails = {m.user_email for m in msgs}
    users = db.query(User).filter(User.email.in_(emails)).all() if emails else []
    avatars = {u.email: (u.avatar_url or "") for u in users}

    return {
        "messages": [{
            "id": m.id,
            "parent_id": m.parent_id,
            "user_email": m.user_email,
            "author": m.author,
            "message": m.message,
            "created_at": m.created_at.isoformat() + "Z" if m.created_at else None,
        } for m in msgs],
        "avatars": avatars,
    }

@app.post("/api/forum")
def post_forum(data: ForumCreate, db: Session = Depends(get_db)):
    # Писати можуть лише зареєстровані користувачі
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=403, detail="Писати у форум можуть лише зареєстровані користувачі.")

    text = (data.message or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Повідомлення порожнє.")
    if len(text) > 1000:
        raise HTTPException(status_code=400, detail="Максимум 1000 символів.")

    if data.parent_id is not None:
        parent = db.query(ForumMessage).filter(ForumMessage.id == data.parent_id).first()
        if not parent:
            raise HTTPException(status_code=404, detail="Повідомлення, на яке ви відповідаєте, не знайдено.")

    msg = ForumMessage(
        parent_id=data.parent_id,
        user_email=user.email,
        author=user.display_name,
        message=text,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"message": "Повідомлення додано!", "id": msg.id}

@app.delete("/api/forum/{message_id}")
def delete_forum_message(message_id: int, email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    msg = db.query(ForumMessage).filter(ForumMessage.id == message_id).first()
    if not user or not msg:
        raise HTTPException(status_code=404, detail="Не знайдено.")
    if msg.user_email != user.email and not user.is_admin:
        raise HTTPException(status_code=403, detail="Можна видаляти лише свої повідомлення.")

    # Видаляємо повідомлення разом з усіма відповідями
    to_delete = [msg.id]
    queue = [msg.id]
    while queue:
        children = db.query(ForumMessage).filter(ForumMessage.parent_id.in_(queue)).all()
        queue = [c.id for c in children]
        to_delete.extend(queue)

    db.query(ForumMessage).filter(ForumMessage.id.in_(to_delete)).delete(synchronize_session=False)
    db.commit()
    return {"message": "Видалено."}