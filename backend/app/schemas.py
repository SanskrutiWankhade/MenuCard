from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class OrderCreate(BaseModel):
    category_id: int
    username: str
    item: Optional[str] = None

class OrderOut(BaseModel):
    id: int
    category_id: int
    username: str
    item: Optional[str]
    created_at: Optional[datetime]
    class Config:
        orm_mode = True

# ---- new schema ----
class MenuItemOut(BaseModel):
    id: int
    category_id: int
    name: str
    price: Optional[float] = None
    image: Optional[str] = None   # <-- new
    class Config:
        orm_mode = True

