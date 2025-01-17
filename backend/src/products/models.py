from typing import TYPE_CHECKING
from sqlalchemy import and_
from src.audit_logs.models import AuditLog
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, foreign
from enum import Enum

if TYPE_CHECKING:
    from src.orders.models import OrderProduct


class Category(str, Enum):
    FOOD = "food"
    NONFOOD = "nonfood"
    SPECIAL = "special"

    def __str__(self):
        return self.value.title()


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    category: Mapped[Category] = mapped_column(nullable=False)
    image: Mapped[str | None] = mapped_column(nullable=True)
    points: Mapped[int] = mapped_column(nullable=False)
    total_qty: Mapped[int] = mapped_column(nullable=False)

    logs: Mapped[list["AuditLog"]] = relationship(
        "AuditLog",
        backref="product",
        primaryjoin=and_(
            id == foreign(AuditLog.parent_id), AuditLog.parent_type == "product"
        ),
        order_by="AuditLog.created_at.desc()",
    )

    order_products: Mapped[list["OrderProduct"]] = relationship(
        "OrderProduct", back_populates="product", order_by="OrderProduct.id.desc()"
    )
