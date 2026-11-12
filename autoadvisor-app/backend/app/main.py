
import os
import re
import time
import secrets
import base64
import hashlib
import hmac
import json

from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, Header
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel, EmailStr

from .database import engine, Base, get_db
from .models import User, Car, CarImage, Review, Booking, ForumMessage
from .decision_tree import evaluate_car_liquidity
from .mailer import send_email_alert, send_reset_code_email
from .ai_chat import router as ai_router

load_dotenv()

_AUTH_SECRET = os.getenv("AUTOADVISOR_AUTH_SECRET") or secrets.token_urlsafe(48)
_TOKEN_MAX_AGE = 7 * 24 * 60 * 60


def _issue_access_token(user: User) -> str:
    payload = {
        "uid": user.id,
        "iat": int(time.time())
    }

    raw = base64.urlsafe_b64encode(
        json.dumps(
            payload,
            separators=(",", ":")
        ).encode("utf-8")
    ).rstrip(b"=").decode("ascii")

    signature = hmac.new(
        _AUTH_SECRET.encode("utf-8"),
        raw.encode("ascii"),
        hashlib.sha256
    ).hexdigest()

    return f"{raw}.{signature}"


def _forum_current_user(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Увійдіть повторно, щоб видаляти повідомлення."
        )

    token = authorization[7:].strip()

    try:
        encoded, provided_signature = token.split(".", 1)

        expected_signature = hmac.new(
            _AUTH_SECRET.encode("utf-8"),
            encoded.encode("ascii"),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_signature, provided_signature):
            raise ValueError("Invalid signature")

        padded = encoded + "=" * (-len(encoded) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded))

        age = time.time() - int(payload["iat"])

        if age < 0 or age > _TOKEN_MAX_AGE:
            raise ValueError("Expired token")

        user_id = int(payload["uid"])
    except (ValueError, TypeError, KeyError, UnicodeDecodeError):
        raise HTTPException(
            status_code=401,
            detail="Сесія недійсна. Увійдіть повторно."
        )

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Користувача не знайдено."
        )

    return user


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AutoAdvisor Production API",
    version="6.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(ai_router)


def user_payload(user, message: str):
    return {
        "message": message,
        "id": user.id,
        "user_id": user.id,
        "access_token": _issue_access_token(user),
        "email": user.email,
        "is_admin": bool(user.is_admin),
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
        "email_alerts": (
            user.email_alerts
            if user.email_alerts is not None
            else True
        ),
        "delivery_frequency": (
            user.delivery_frequency or "Daily digest"
        ),
        "min_liquidity": (
            user.min_liquidity
            if user.min_liquidity is not None
            else 85
        )
    }


RESET_CODE_TTL = 10 * 60
MAX_RESET_ATTEMPTS = 5
reset_codes_db = {}


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str


def check_reset_code(email: str, code: str):
    entry = reset_codes_db.get(email)

    if not entry or time.time() > entry["expires"]:
        reset_codes_db.pop(email, None)
        raise HTTPException(
            status_code=400,
            detail="Код прострочений. Запросіть новий."
        )

    if entry["attempts"] >= MAX_RESET_ATTEMPTS:
        reset_codes_db.pop(email, None)
        raise HTTPException(
            status_code=429,
            detail="Забагато спроб. Запросіть новий код."
        )

    if not secrets.compare_digest(
        entry["code"], code.strip()
    ):
        entry["attempts"] += 1
        raise HTTPException(
            status_code=400,
            detail="Невірний код підтвердження."
        )


@app.post("/api/auth/verify-code")
def verify_code(data: VerifyCodeRequest):
    check_reset_code(data.email, data.code)
    return {"message": "Код підтверджено."}


@app.on_event("startup")
def startup_db():
    db = next(get_db())

    try:
        admin_email = os.getenv("ADMIN_EMAIL")
        admin_password = os.getenv("ADMIN_PASSWORD")

        if admin_email and admin_password:
            admin_exists = db.query(User).filter(
                User.email == admin_email
            ).first()

            if not admin_exists:
                db.add(User(
                    email=admin_email,
                    password=admin_password,
                    display_name="Sasha Admin",
                    is_admin=True
                ))

        if db.query(Car).count() == 0:
            db.add_all([
                Car(
                    brand="BMW",
                    model="330i M Sport",
                    year=2022,
                    body_type="Sedan",
                    transmission="Automatic",
                    mileage=24180,
                    price=38450,
                    badge="BEST MATCH",
                    image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
                    description="Динамічний преміум седан із чудовою керованістю та спортивним характером."
                ),
                Car(
                    brand="Mercedes-Benz",
                    model="C300",
                    year=2023,
                    body_type="Sedan",
                    transmission="Automatic",
                    mileage=18820,
                    price=41290,
                    badge="High liquidity",
                    image_url="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
                    description="Комфортабельний німецький автомобіль з розкішним салоном та високою ліквідністю."
                ),
                Car(
                    brand="Mercedes-AMG",
                    model="C43",
                    year=2021,
                    body_type="Coupe",
                    transmission="Automatic",
                    mileage=31450,
                    price=46800,
                    badge="High liquidity",
                    image_url="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
                    description="Спортивне купе для поціновувачів потужності й керованості."
                )
            ])

        if db.query(Review).count() == 0:
            db.add_all([
                Review(
                    author="Денис М.",
                    comment="Саме те, що я шукав для щоденної роботи. Швидко, охайно й без зайвих складнощів.",
                    rating=5
                ),
                Review(
                    author="Софія Р.",
                    comment="Загалом чудовий досвід. Особливо сподобалося, як легко знайти потрібну інформацію.",
                    rating=5
                ),
                Review(
                    author="Тарас В.",
                    comment="Хороший старт і зрозумілий інтерфейс. Є кілька дрібниць, які ще можна вдосконалити.",
                    rating=4
                )
            ])

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


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
    images: Optional[List[str]] = None
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
    images: Optional[List[str]] = None
    description: Optional[str] = None


class ReviewCreate(BaseModel):
    author: str
    comment: str
    rating: int = 5


class BookingCreate(BaseModel):
    user_email: EmailStr
    car_id: int
    phone: str
    comment: Optional[str] = ""


class ArchiveToggle(BaseModel):
    is_archived: bool


class BookingStatusUpdate(BaseModel):
    status: str


class ForumCreate(BaseModel):
    email: str
    message: str
    parent_id: Optional[int] = None
    author: Optional[str] = None
    avatar_url: Optional[str] = None


PHONE_LENGTHS = {
    "380": 9,
    "48": 9,
    "49": 10,
    "1": 10,
    "44": 10,
    "420": 9,
    "33": 9,
    "39": 10
}


def validate_booking_phone(phone: str) -> str:
    phone = phone.strip()

    if not re.fullmatch(r"\+[1-9]\d{7,14}", phone):
        raise HTTPException(
            status_code=422,
            detail="Неправильний формат номера телефону."
        )

    for prefix, length in sorted(
        PHONE_LENGTHS.items(),
        key=lambda item: len(item[0]),
        reverse=True
    ):
        if phone.startswith("+" + prefix):
            national = phone[len(prefix) + 1:]

            if len(national) != length:
                raise HTTPException(
                    status_code=422,
                    detail="Неправильна довжина номера телефону."
                )

            if prefix == "380" and national.startswith("0"):
                raise HTTPException(
                    status_code=422,
                    detail="Перевірте український номер телефону."
                )

            return phone

    raise HTTPException(
        status_code=422,
        detail="Країна номера телефону не підтримується."
    )


@app.post("/api/register")
def register_user(
    data: UserRegister,
    db: Session = Depends(get_db)
):
    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Пароль має містити мінімум 8 символів."
        )

    existing = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Користувач із таким email вже існує."
        )

    user = User(
        email=data.email,
        password=data.password,
        display_name=data.display_name.strip(),
        is_admin=False
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user_payload(user, "Успішна реєстрація!")


@app.post("/api/login")
def login_user(
    data: UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email,
        User.password == data.password
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Невірний email або пароль."
        )

    return user_payload(user, "Вхід успішний!")


@app.post("/api/auth/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user:
        code = f"{secrets.randbelow(900000) + 100000}"

        reset_codes_db[data.email] = {
            "code": code,
            "expires": time.time() + RESET_CODE_TTL,
            "attempts": 0
        }

        try:
            send_reset_code_email(
                to_email=data.email,
                title="Код відновлення пароля",
                code=code
            )
        except Exception as error:
            print("Email error:", type(error).__name__)

    return {
        "message": "Якщо адреса зареєстрована, код відновлення надіслано."
    }


@app.post("/api/auth/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    check_reset_code(data.email, data.code)

    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Пароль має містити мінімум 8 символів."
        )

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Користувача не знайдено."
        )

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
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Користувача не знайдено."
        )

    if data.new_password:
        if not data.current_password:
            raise HTTPException(
                status_code=400,
                detail="Вкажіть поточний пароль."
            )

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

    if not data.display_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Ім'я не може бути порожнім."
        )

    user.display_name = data.display_name.strip()
    user.email_alerts = data.email_alerts
    user.delivery_frequency = data.delivery_frequency
    user.min_liquidity = data.min_liquidity
    user.avatar_url = data.avatar_url

    db.commit()
    db.refresh(user)

    return {
        "message": "Налаштування успішно збережено!",
        "user": user_payload(user, "")
    }


def booking_payload(booking):
    return {
        "id": booking.id,
        "user_email": booking.user_email,
        "car_id": booking.car_id,
        "phone": booking.phone,
        "comment": booking.comment,
        "status": booking.status,
        "created_at": (
            booking.created_at.isoformat()
            if booking.created_at
            else None
        ),
        "decided_at": (
            booking.decided_at.isoformat()
            if booking.decided_at
            else None
        ),
        "purchase_price": booking.purchase_price
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
    query = (
        db.query(Car)
        .options(joinedload(Car.images))
        .filter(Car.is_deleted == False)
    )

    if budget_max:
        query = query.filter(Car.price <= budget_max)

    if brand != "All":
        query = query.filter(Car.brand == brand)

    if body_type != "Any":
        query = query.filter(Car.body_type == body_type)

    if transmission != "Any":
        query = query.filter(Car.transmission == transmission)

    cars = query.all()

    pending_ids = {
        car_id
        for (car_id,) in db.query(Booking.car_id).filter(
            Booking.status == "pending"
        ).all()
    }

    result = []

    for car in cars:
        metrics = evaluate_car_liquidity(
            car.mileage,
            car.year,
            car.brand
        )

        score = (
            car.custom_liquidity
            if car.custom_liquidity is not None
            else metrics["liquidity_score"]
        )

        if score < min_liquidity:
            continue

        images = [
            item.image_url
            for item in car.images
            if item.image_url
        ] or [car.image_url]

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
            "images": images,
            "image_urls": images,
            "discount": 0,
            "description": car.description,
            "liquidity_score": score,
            "liquidity_status": metrics["liquidity_status"],
            "is_archived": bool(car.is_archived),
            "booking_status": (
                "pending" if car.id in pending_ids else None
            )
        })

    result.sort(
        key=lambda car: (
            car["is_archived"],
            car["id"]
        )
    )

    return result


@app.post("/api/admin/cars")
def add_car(
    car_data: CarCreate,
    db: Session = Depends(get_db)
):
    images = (
        car_data.images
        if car_data.images
        else [car_data.image_url]
    )

    images = list(dict.fromkeys(
        url for url in images if url
    ))[:8]

    if not images:
        raise HTTPException(
            status_code=400,
            detail="Додайте хоча б одну фотографію."
        )

    car = Car(
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
        image_url=images[0],
        description=car_data.description
    )

    db.add(car)
    db.flush()

    for position, url in enumerate(images):
        db.add(CarImage(
            car_id=car.id,
            image_url=url,
            position=position
        ))

    db.commit()
    db.refresh(car)

    metrics = evaluate_car_liquidity(
        car.mileage,
        car.year,
        car.brand
    )

    score = (
        car.custom_liquidity
        if car.custom_liquidity is not None
        else metrics["liquidity_score"]
    )

    subscribers = db.query(User).filter(
        User.email_alerts == True
    ).all()

    for user in subscribers:
        if score >= (user.min_liquidity or 0):
            try:
                send_email_alert(
                    to_email=user.email,
                    car_title=f"{car.brand} {car.model}",
                    price=car.price
                )
            except Exception:
                pass

    return {
        "message": "Авто успішно додано в MySQL!",
        "car_id": car.id
    }


@app.put("/api/admin/cars/{car_id}")
def update_car(
    car_id: int,
    car_data: CarUpdateModel,
    db: Session = Depends(get_db)
):
    car = db.query(Car).filter(
        Car.id == car_id
    ).first()

    if not car:
        raise HTTPException(
            status_code=404,
            detail="Автомобіль не знайдено."
        )

    fields = [
        "brand",
        "model",
        "year",
        "body_type",
        "transmission",
        "mileage",
        "price",
        "engine_volume",
        "custom_liquidity",
        "badge",
        "description"
    ]

    for field in fields:
        value = getattr(car_data, field)

        if value is not None:
            setattr(car, field, value)

    if car_data.images is not None:
        images = list(dict.fromkeys(
            url for url in car_data.images if url
        ))[:8]

        if not images:
            raise HTTPException(
                status_code=400,
                detail="Потрібна хоча б одна фотографія."
            )

        db.query(CarImage).filter(
            CarImage.car_id == car_id
        ).delete(synchronize_session=False)

        for position, url in enumerate(images):
            db.add(CarImage(
                car_id=car.id,
                image_url=url,
                position=position
            ))

        car.image_url = images[0]

    elif car_data.image_url is not None:
        car.image_url = car_data.image_url

    db.commit()
    db.refresh(car)

    return {"message": "Автомобіль успішно оновлено!"}


@app.delete("/api/admin/cars/{car_id}")
def delete_car(
    car_id: int,
    db: Session = Depends(get_db)
):
    car = db.query(Car).filter(
        Car.id == car_id
    ).first()

    if not car:
        raise HTTPException(
            status_code=404,
            detail="Автомобіль не знайдено."
        )

    pending = db.query(Booking.id).filter(
        Booking.car_id == car_id,
        Booking.status == "pending"
    ).first()

    if pending:
        raise HTTPException(
            status_code=409,
            detail="Спочатку підтвердіть або відхиліть активне бронювання."
        )

    car.is_deleted = True
    car.is_archived = True

    db.commit()

    return {
        "message": "Автомобіль приховано. Історію покупок збережено.",
        "car_id": car.id
    }


@app.get("/api/bookings")
def get_bookings(
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).order_by(
        Booking.id.desc()
    ).all()

    return [
        booking_payload(booking)
        for booking in bookings
    ]


@app.get("/api/users/{email}/bookings")
def user_bookings(
    email: str,
    db: Session = Depends(get_db)
):
    rows = (
        db.query(Booking, Car)
        .join(Car, Booking.car_id == Car.id)
        .filter(Booking.user_email == email)
        .order_by(Booking.id.desc())
        .all()
    )

    return [
        {
            **booking_payload(booking),
            "car_title": f"{car.brand} {car.model}",
            "image_url": car.image_url,
            "car_price": car.price
        }
        for booking, car in rows
    ]


@app.post("/api/bookings", status_code=201)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db)
):
    validated_phone = validate_booking_phone(data.phone)

    try:
        car = (
            db.query(Car)
            .filter(Car.id == data.car_id)
            .with_for_update()
            .first()
        )

        if not car:
            raise HTTPException(
                status_code=404,
                detail="Автомобіль не знайдено."
            )

        if car.is_archived:
            raise HTTPException(
                status_code=409,
                detail="Автомобіль знаходиться в архіві."
            )

        existing = (
            db.query(Booking.id)
            .filter(
                Booking.car_id == car.id,
                Booking.status == "pending"
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="Цей автомобіль уже заброньовано."
            )

        user = db.query(User).filter(
            User.email == data.user_email
        ).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="Користувача не знайдено."
            )

        booking = Booking(
            user_email=user.email,
            car_id=car.id,
            phone=validated_phone,
            comment=data.comment or "",
            status="pending",
            created_at=datetime.utcnow(),
            decided_at=None,
            purchase_price=None
        )

        db.add(booking)
        db.commit()
        db.refresh(booking)

        return booking_payload(booking)
    except Exception:
        db.rollback()
        raise


@app.put("/api/admin/bookings/{booking_id}")
def update_booking_status(
    booking_id: int,
    status_data: BookingStatusUpdate,
    db: Session = Depends(get_db)
):
    if status_data.status not in ("approved", "rejected"):
        raise HTTPException(
            status_code=400,
            detail="Невірний статус бронювання."
        )

    try:
        target = db.query(Booking).filter(
            Booking.id == booking_id
        ).first()

        if not target:
            raise HTTPException(
                status_code=404,
                detail="Бронювання не знайдено."
            )

        car = (
            db.query(Car)
            .filter(Car.id == target.car_id)
            .with_for_update()
            .first()
        )

        if not car:
            raise HTTPException(
                status_code=404,
                detail="Автомобіль не знайдено."
            )

        booking = (
            db.query(Booking)
            .filter(Booking.id == booking_id)
            .with_for_update()
            .first()
        )

        if booking.status != "pending":
            raise HTTPException(
                status_code=409,
                detail="Рішення за заявкою вже прийнято."
            )

        if status_data.status == "approved":
            if car.is_archived:
                raise HTTPException(
                    status_code=409,
                    detail="Автомобіль уже знаходиться в архіві."
                )

            booking.status = "approved"
            booking.decided_at = datetime.utcnow()
            booking.purchase_price = float(car.price)
            car.is_archived = True
        else:
            booking.status = "rejected"
            booking.decided_at = datetime.utcnow()
            booking.purchase_price = None

        db.commit()
        db.refresh(booking)

        return booking_payload(booking)
    except Exception:
        db.rollback()
        raise


@app.put("/api/admin/cars/{car_id}/archive")
def set_car_archive(
    car_id: int,
    data: ArchiveToggle,
    db: Session = Depends(get_db)
):
    try:
        car = (
            db.query(Car)
            .filter(Car.id == car_id)
            .with_for_update()
            .first()
        )

        if not car:
            raise HTTPException(
                status_code=404,
                detail="Автомобіль не знайдено."
            )

        car.is_archived = data.is_archived

        if not data.is_archived:
            pending_bookings = (
                db.query(Booking)
                .filter(
                    Booking.car_id == car.id,
                    Booking.status == "pending"
                )
                .with_for_update()
                .all()
            )

            for booking in pending_bookings:
                booking.status = "rejected"
                booking.decided_at = datetime.utcnow()
                booking.purchase_price = None

        db.commit()

        return {
            "message": (
                "Автомобіль переміщено в архів."
                if data.is_archived
                else "Автомобіль повернуто в каталог."
            ),
            "car_id": car.id,
            "is_archived": bool(car.is_archived),
            "booking_status": None
        }
    except Exception:
        db.rollback()
        raise


@app.delete("/api/admin/bookings/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Бронювання не знайдено."
        )

    if booking.status == "approved":
        raise HTTPException(
            status_code=409,
            detail="Підтверджену покупку не можна видаляти."
        )

    db.delete(booking)
    db.commit()

    return {"message": "Бронювання видалено."}


@app.get("/api/reviews")
def get_reviews(
    db: Session = Depends(get_db)
):
    return db.query(Review).all()


@app.post("/api/reviews")
def add_review(
    data: ReviewCreate,
    db: Session = Depends(get_db)
):
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Оцінка має бути від 1 до 5."
        )

    review = Review(
        author=data.author,
        comment=data.comment,
        rating=data.rating
    )

    db.add(review)
    db.commit()

    return {"message": "Відгук додано!"}


@app.get("/api/forum")
def get_forum(
    db: Session = Depends(get_db)
):
    messages = db.query(ForumMessage).order_by(
        ForumMessage.created_at.asc()
    ).all()

    emails = {
        message.user_email
        for message in messages
    }

    users = (
        db.query(User)
        .filter(User.email.in_(emails))
        .all()
        if emails
        else []
    )

    avatars = {
        user.email: user.avatar_url or ""
        for user in users
    }

    return {
        "messages": [
            {
                "id": message.id,
                "parent_id": message.parent_id,
                "user_email": message.user_email,
                "author": message.author,
                "message": message.message,
                "created_at": (
                    message.created_at.isoformat() + "Z"
                    if message.created_at
                    else None
                )
            }
            for message in messages
        ],
        "avatars": avatars
    }


@app.post("/api/forum")
def post_forum(
    data: ForumCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=403,
            detail="Лише зареєстровані користувачі можуть писати у форум."
        )

    text = (data.message or "").strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Повідомлення порожнє."
        )

    if len(text) > 1000:
        raise HTTPException(
            status_code=400,
            detail="Максимум 1000 символів."
        )

    if data.parent_id is not None:
        parent = db.query(ForumMessage).filter(
            ForumMessage.id == data.parent_id
        ).first()

        if not parent:
            raise HTTPException(
                status_code=404,
                detail="Повідомлення, на яке ви відповідаєте, не знайдено."
            )

    message = ForumMessage(
        parent_id=data.parent_id,
        user_email=user.email,
        author=user.display_name,
        message=text
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return {
        "message": "Повідомлення додано!",
        "id": message.id
    }


@app.delete("/api/forum/{message_id}")
def delete_forum_message(
    message_id: int,
    current_user: User = Depends(_forum_current_user),
    db: Session = Depends(get_db)
):
    message = db.query(ForumMessage).filter(
        ForumMessage.id == message_id
    ).first()

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Повідомлення не знайдено."
        )

    if (
        message.user_email.casefold() != current_user.email.casefold()
        and not current_user.is_admin
    ):
        raise HTTPException(
            status_code=403,
            detail="Можна видаляти лише свої повідомлення."
        )

    try:
        db.query(ForumMessage).filter(
            ForumMessage.parent_id == message.id
        ).update(
            {ForumMessage.parent_id: message.parent_id},
            synchronize_session=False
        )

        db.delete(message)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return {
        "message": "Повідомлення видалено, відповіді збережено.",
        "id": message_id
    }
