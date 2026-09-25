from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


# ---------- Lo que envía el frontend ----------

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=20)
    extra_ids: list[int] = Field(default_factory=list)
    sauce_ids: list[int] = Field(default_factory=list)

class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(min_length=1)


# ---------- Lo que devuelve la API ----------

class OrderItemOptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_name: str
    category: str
    price: float

class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_name: str
    quantity: int
    base_price: float
    unit_price: float
    subtotal: float
    options: list[OrderItemOptionOut]

class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    total: float
    created_at: datetime
    items: list[OrderItemOut]