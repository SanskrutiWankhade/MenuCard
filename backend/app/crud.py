from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def get_categories(db: Session) -> List[models.Category]:
    return db.query(models.Category).all()

def get_category(db: Session, category_id: int) -> Optional[models.Category]:
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_orders_by_category(db: Session, category_id: int) -> List[models.Order]:
    # Always return a list (possibly empty)
    orders = (
        db.query(models.Order)
        .filter(models.Order.category_id == category_id)
        .order_by(models.Order.id.desc())
        .all()
    )
    return orders or []

def create_order(db: Session, order: schemas.OrderCreate) -> models.Order:
    db_order = models.Order(
        category_id=order.category_id, username=order.username, item=order.item
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_order(db: Session, order_id: int) -> Optional[models.Order]:
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def delete_order(db: Session, order_id: int) -> bool:
    db_order = get_order(db, order_id)
    if not db_order:
        return False
    db.delete(db_order)
    db.commit()
    return True

def get_menu_items_by_category(db: Session, category_id: int):
    return db.query(models.MenuItem).filter(models.MenuItem.category_id == category_id).order_by(models.MenuItem.id).all()