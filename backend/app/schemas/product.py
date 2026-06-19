from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    sku: str = Field(..., min_length=1, max_length=100)
    price: Decimal = Field(..., gt=0, decimal_places=2)
    quantity: int = Field(..., ge=0)
    category: str | None = Field(None, max_length=100)
    reorder_point: int = Field(0, ge=0)
    supplier: str | None = Field(None, max_length=255)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    sku: str | None = Field(None, min_length=1, max_length=100)
    price: Decimal | None = Field(None, gt=0, decimal_places=2)
    quantity: int | None = Field(None, ge=0)
    category: str | None = Field(None, max_length=100)
    reorder_point: int | None = Field(None, ge=0)
    supplier: str | None = Field(None, max_length=255)


class ProductRead(ProductBase):
    model_config = {"from_attributes": True}
    id: int
    created_at: datetime
    updated_at: datetime
