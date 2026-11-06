from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey # type: ignore
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    email_alerts = Column(Boolean, default=True)
    delivery_frequency = Column(String(50), default="Daily digest")
    min_liquidity = Column(Integer, default=85)


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    body_type = Column(String(50), nullable=False)
    transmission = Column(String(50), nullable=False)
    mileage = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    engine_volume = Column(String(50), default="2.0L")
    custom_liquidity = Column(Integer, nullable=True)
    badge = Column(String(50), default="AI RECOMMEND")
    image_url = Column(String(500), nullable=False)
    description = Column(String(1000), default="Опис відсутній")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String(100), nullable=False)
    comment = Column(String(1000), nullable=False)
    rating = Column(Integer, default=5)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), nullable=False)
    car_id = Column(Integer, nullable=False)
    phone = Column(String(50), nullable=False)
    comment = Column(String(500), nullable=True)
    status = Column(String(50), default="pending")  # pending, approved, rejected