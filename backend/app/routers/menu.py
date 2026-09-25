from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.constants import MAX_EXTRAS_PER_BURGER, MAX_SAUCES_PER_BURGER
from app.database import get_db
from app.models import Product, ProductCategory
from app.schemas.menu import MenuOut

router = APIRouter(prefix="/menu", tags=["Menú"])

@router.get("", response_model=MenuOut)
def get_menu(db: Session = Depends(get_db)):
    products = db.scalars(select(Product).order_by(Product.id)).all()

    def by_category(category: ProductCategory) -> list[Product]:
        return [product for product in products if product.category == category]

    return {
        "burgers": by_category(ProductCategory.BURGER),
        "extras": by_category(ProductCategory.EXTRA),
        "sauces": by_category(ProductCategory.SAUCE),
        "sides": by_category(ProductCategory.SIDE),
        "drinks": by_category(ProductCategory.DRINK),
        "rules": {
            "max_extras": MAX_EXTRAS_PER_BURGER,
            "max_sauces": MAX_SAUCES_PER_BURGER,
        },
    }