"""add category, reorder_point, supplier to products

Revision ID: 002
Revises: 001
Create Date: 2024-01-02 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("products", sa.Column("category", sa.String(100), nullable=True))
    op.add_column(
        "products",
        sa.Column("reorder_point", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column("products", sa.Column("supplier", sa.String(255), nullable=True))


def downgrade() -> None:
    op.drop_column("products", "supplier")
    op.drop_column("products", "reorder_point")
    op.drop_column("products", "category")
