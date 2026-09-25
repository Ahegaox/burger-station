from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.constants import MAX_EXTRAS_PER_BURGER, MAX_SAUCES_PER_BURGER
from app.models import Order, OrderItem, OrderItemOption, Product, ProductCategory, User
from app.schemas.order import OrderCreate

class OrderError(Exception):
    """Error de negocio al crear un pedido (datos que no cumplen las reglas)."""

ORDERABLE_CATEGORIES = {ProductCategory.BURGER, ProductCategory.SIDE, ProductCategory.DRINK}

def create_order(db: Session, user: User, order_in: OrderCreate) -> Order:
    products = _load_products(db, order_in)
    order = Order(user_id=user.id)
    total = 0

    for item_in in order_in.items:
        product = products.get(item_in.product_id)
        if product is None or product.category not in ORDERABLE_CATEGORIES:
            raise OrderError(f"El producto {item_in.product_id} no se puede pedir")

        is_burger = product.category == ProductCategory.BURGER
        if not is_burger and (item_in.extra_ids or item_in.sauce_ids):
            raise OrderError(f"'{product.name}' no admite extras ni salsas")

        extras = _get_options(
            products, item_in.extra_ids, ProductCategory.EXTRA, MAX_EXTRAS_PER_BURGER, "extras"
        )
        sauces = _get_options(
            products, item_in.sauce_ids, ProductCategory.SAUCE, MAX_SAUCES_PER_BURGER, "salsas"
        )
        options = extras + sauces

        unit_price = product.price + sum(option.price for option in options)
        subtotal = unit_price * item_in.quantity
        total += subtotal

        order.items.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                quantity=item_in.quantity,
                base_price=product.price,
                unit_price=unit_price,
                subtotal=subtotal,
                options=[
                    OrderItemOption(
                        product_id=option.id,
                        product_name=option.name,
                        category=option.category,
                        price=option.price,
                    )
                    for option in options
                ],
            )
        )

    order.total = total
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

def _load_products(db: Session, order_in: OrderCreate) -> dict[int, Product]:
    ids = set()
    for item in order_in.items:
        ids.add(item.product_id)
        ids.update(item.extra_ids)
        ids.update(item.sauce_ids)

    products = db.scalars(select(Product).where(Product.id.in_(ids)))
    return {product.id: product for product in products}

def _get_options(
    products: dict[int, Product],
    ids: list[int],
    category: ProductCategory,
    max_allowed: int,
    label: str,
) -> list[Product]:
    if len(ids) != len(set(ids)):
        raise OrderError(f"Hay {label} repetidos")
    if len(ids) > max_allowed:
        raise OrderError(f"Máximo {max_allowed} {label} por hamburguesa")

    options = []
    for option_id in ids:
        option = products.get(option_id)
        if option is None or option.category != category:
            raise OrderError(f"El producto {option_id} no es válido en {label}")
        options.append(option)
    return options