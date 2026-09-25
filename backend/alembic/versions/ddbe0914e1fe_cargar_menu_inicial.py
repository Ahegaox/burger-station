"""cargar menu inicial

Revision ID: ddbe0914e1fe
Revises: 45a58c4b223c
Create Date: 2026-09-25 17:02:48.064934

"""
from typing import Sequence, Union
from decimal import Decimal

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'ddbe0914e1fe'
down_revision: Union[str, Sequence[str], None] = '45a58c4b223c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


products_table = sa.table(
    "products",
    sa.column("name", sa.String),
    sa.column("description", sa.String),
    sa.column("price", sa.Numeric),
    sa.column("category", sa.String),
)

MENU = [
    # Hamburguesas
    {"category": "burger", "name": "La Montañesa", "price": Decimal("9.50"),
     "description": "Carne de res artesanal, queso suizo, champiñones salteados, cebolla caramelizada y salsa de hierbas."},
    {"category": "burger", "name": "El Ranchero", "price": Decimal("10.00"),
     "description": "Pollo a la parrilla marinado, tocino crujiente, queso provolone, aros de cebolla fritos y salsa ranch."},
    {"category": "burger", "name": "Veggie Mediterránea", "price": Decimal("8.75"),
     "description": "Medallón de garbanzos y espinacas, queso feta, aceitunas negras, pimientos asados y tzatziki."},
    {"category": "burger", "name": "Doble Búfalo", "price": Decimal("11.75"),
     "description": "Doble carne de res, queso cheddar añejo, pepinillos encurtidos, cebolla roja y salsa búfalo picante."},
    {"category": "burger", "name": "Mar y Tierra", "price": Decimal("13.00"),
     "description": "Carne de res, camarones salteados al ajillo, aguacate y salsa rosada de la casa."},

    # Extras (máximo 3 por hamburguesa)
    {"category": "extra", "name": "Huevo frito", "price": Decimal("1.00"), "description": None},
    {"category": "extra", "name": "Jalapeños", "price": Decimal("0.50"), "description": None},
    {"category": "extra", "name": "Guacamole", "price": Decimal("1.50"), "description": None},
    {"category": "extra", "name": "Piña caramelizada", "price": Decimal("0.75"), "description": None},
    {"category": "extra", "name": "Extra queso cheddar", "price": Decimal("0.80"), "description": None},
    {"category": "extra", "name": "Extra queso mozzarella", "price": Decimal("0.80"), "description": None},

    # Salsas (máximo 2 por hamburguesa)
    {"category": "sauce", "name": "Kétchup", "price": Decimal("0.00"), "description": None},
    {"category": "sauce", "name": "Mayonesa", "price": Decimal("0.00"), "description": None},
    {"category": "sauce", "name": "Mostaza Dijón", "price": Decimal("0.00"), "description": None},
    {"category": "sauce", "name": "Salsa BBQ ahumada", "price": Decimal("0.60"), "description": None},
    {"category": "sauce", "name": "Mayonesa picante", "price": Decimal("0.60"), "description": None},

    # Papas
    {"category": "side", "name": "Papas fritas corte casero", "price": Decimal("2.75"), "description": None},
    {"category": "side", "name": "Papas en cascos con piel", "price": Decimal("3.25"), "description": None},
    {"category": "side", "name": "Batatas fritas", "price": Decimal("3.50"), "description": None},

    # Bebidas
    {"category": "drink", "name": "Limonada natural", "price": Decimal("2.25"), "description": None},
    {"category": "drink", "name": "Gaseosa Cola", "price": Decimal("2.00"), "description": None},
    {"category": "drink", "name": "Gaseosa Naranja", "price": Decimal("2.00"), "description": None},
    {"category": "drink", "name": "Gaseosa Lima-Limón", "price": Decimal("2.00"), "description": None},
    {"category": "drink", "name": "Té helado", "price": Decimal("2.00"), "description": None},
    {"category": "drink", "name": "Agua embotellada", "price": Decimal("1.50"), "description": None},
    {"category": "drink", "name": "Cerveza artesanal sin alcohol", "price": Decimal("4.00"), "description": None},
]


def upgrade() -> None:
    op.bulk_insert(products_table, MENU)


def downgrade() -> None:
    op.execute("DELETE FROM products")
