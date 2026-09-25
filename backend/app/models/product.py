from decimal import Decimal
from enum import StrEnum
from sqlalchemy import Numeric, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class ProductCategory(StrEnum):
    BURGER = "burger"
    EXTRA = "extra"
    SAUCE = "sauce"
    SIDE = "side"
    DRINK = "drink"

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(String(500))
    price: Mapped[Decimal] = mapped_column(Numeric(6, 2))
    category: Mapped[str] = mapped_column(String(20), index=True)