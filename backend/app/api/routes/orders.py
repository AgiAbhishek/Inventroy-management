from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.customer import Customer
from app.schemas.order import OrderCreate, OrderRead, OrderItemRead

router = APIRouter(prefix="/orders", tags=["orders"])


def _serialize_order(order: Order) -> OrderRead:
    items = [
        OrderItemRead(
            id=item.id,
            product_id=item.product_id,
            product_name=item.product.name if item.product else None,
            quantity=item.quantity,
            unit_price=item.unit_price,
        )
        for item in order.items
    ]
    return OrderRead(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer.full_name if order.customer else None,
        total_amount=order.total_amount,
        status=order.status,
        created_at=order.created_at,
        items=items,
    )


def _load_order(db: Session, order_id: int) -> Order:
    order = (
        db.query(Order)
        .options(
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.customer),
        )
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(data: OrderCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total = Decimal("0")
    resolved_items = []

    for item in data.items:
        product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
        if not product:
            raise HTTPException(
                status_code=404, detail=f"Product {item.product_id} not found"
            )
        if item.quantity > product.quantity:
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Insufficient stock for SKU '{product.sku}': "
                    f"have {product.quantity}, need {item.quantity}"
                ),
            )
        unit_price = Decimal(str(product.price))
        total += unit_price * item.quantity
        resolved_items.append((product, item.quantity, unit_price))

    order = Order(customer_id=data.customer_id, total_amount=total)
    db.add(order)
    db.flush()

    for product, qty, unit_price in resolved_items:
        product.quantity -= qty
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=qty,
                unit_price=unit_price,
            )
        )

    db.commit()
    return _serialize_order(_load_order(db, order.id))


@router.get("", response_model=list[OrderRead])
def list_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .options(
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.customer),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_serialize_order(o) for o in orders]


@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return _serialize_order(_load_order(db, order_id))


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = _load_order(db, order_id)

    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity

    db.delete(order)
    db.commit()
