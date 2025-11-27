from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, Text, Numeric
from sqlalchemy.orm import relationship
from .database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    orders = relationship("Order", back_populates="category")
    menu_items = relationship("MenuItem", back_populates="category")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    username = Column(String(150), nullable=False)
    item = Column(Text)
    created_at = Column(TIMESTAMP)
    category = relationship("Category", back_populates="orders")

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    name = Column(String(200), nullable=False)
    price = Column(Numeric(8,2), nullable=True)
    image = Column(String(255), nullable=True)   # <-- new
    category = relationship("Category", back_populates="menu_items")

