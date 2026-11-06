from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    display_name = Column(String(100), default="User")
    is_admin = Column(Boolean, default=False)
    # Поля налаштувань сповіщень
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
    engine_volume = Column(String(20), default="2.0L")  # Об'єм двигуна
    custom_liquidity = Column(Integer, nullable=True)     # Кастомна ліквідність від адміна
    badge = Column(String(50), default="BEST MATCH")
    image_url = Column(String(500), nullable=True)
    description = Column(Text, default="Надійний та комфортний автомобіль із чудовими характеристиками для щоденних поїздок.")
    
class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    author = Column(String(100), nullable=False)
    comment = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)