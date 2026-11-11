from datetime import datetime
from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    Text
)
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import relationship
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
    avatar_url = Column(Text, nullable=True)


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
    image_url = Column(LONGTEXT, nullable=False)
    description = Column(String(1000), default="Опис відсутній")
    is_archived = Column(Boolean, default=False, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    images = relationship(
        "CarImage",
        cascade="all, delete-orphan",
        back_populates="car",
        order_by="CarImage.position"
    )


class CarImage(Base):
    __tablename__ = "car_images"

    id = Column(Integer, primary_key=True)
    car_id = Column(
        Integer,
        ForeignKey("cars.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    image_url = Column(LONGTEXT, nullable=False)
    position = Column(Integer, default=0, nullable=False)

    car = relationship(
        "Car",
        back_populates="images"
    )


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String(100), nullable=False)
    comment = Column(String(1000), nullable=False)
    rating = Column(Integer, default=5)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), nullable=False, index=True)
    car_id = Column(
        Integer,
        ForeignKey("cars.id"),
        nullable=False,
        index=True
    )
    phone = Column(String(50), nullable=False)
    comment = Column(String(500), nullable=True)
    status = Column(String(50), default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    decided_at = Column(DateTime, nullable=True)
    purchase_price = Column(Float, nullable=True)


class ForumMessage(Base):
    __tablename__ = "forum_messages"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, nullable=True, index=True)
    user_email = Column(String(255), index=True, nullable=False)
    author = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
