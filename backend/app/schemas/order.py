from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderItemRead(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    product_id: int
    product_name: str | None = None
    quantity: int
    unit_price: Decimal


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderRead(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    customer_id: int
    customer_name: str | None = None
    total_amount: Decimal
    status: str
    created_at: datetime
    items: list[OrderItemRead] = []
