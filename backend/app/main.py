from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from .database import engine, Base, get_db
from . import models, schemas, crud
from dotenv import load_dotenv

load_dotenv()

# ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Order Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/categories", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)

@app.get("/categories/{category_id}/orders", response_model=List[schemas.OrderOut])
def list_orders(category_id: int, db: Session = Depends(get_db)):
    # ensure category exists first (optional, but helpful)
    if not crud.get_category(db, category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    orders = crud.get_orders_by_category(db, category_id)
    # defensive: ensure a list is returned
    if orders is None:
        return []
    return orders

@app.post("/orders", response_model=schemas.OrderOut)
def add_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not crud.get_category(db, order.category_id):
        raise HTTPException(status_code=400, detail="Invalid category")
    return crud.create_order(db, order)

@app.delete("/orders/{order_id}")
def delete_order_endpoint(order_id: int, db: Session = Depends(get_db)):
    """
    Delete an order by id.
    """
    if not crud.get_order(db, order_id):
        raise HTTPException(status_code=404, detail="Order not found")
    success = crud.delete_order(db, order_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete order")
    return {"detail": "Order deleted"}

@app.get("/categories/{category_id}/menu", response_model=List[schemas.MenuItemOut])
def list_menu(category_id: int, db: Session = Depends(get_db)):
    # optional: verify category exists
    if not crud.get_category(db, category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    items = crud.get_menu_items_by_category(db, category_id)
    return items or []