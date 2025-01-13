from enum import Enum

from sqlalchemy import ForeignKey, and_
from src.audit_logs.models import AuditLog
from src.auth.models import User
from src.common.base import Base
from sqlalchemy.orm import Mapped, relationship, mapped_column, foreign

from src.products.models import Product


class OrderState(str, Enum):
    """
    Possible transitions:

    PENDING --> APPROVED --> CLAIMED

    PENDING --> REJECTED

    PENDING --> WITHDRAWN
    """

    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    CLAIMED = "claimed"


class Order(Base):
    """An order has many products."""

    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    state: Mapped[OrderState] = mapped_column(
        default=OrderState.PENDING, nullable=False
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    user: Mapped[User] = relationship("User", backref="orders")
    order_products: Mapped[list["OrderProduct"]] = relationship(
        "OrderProduct", back_populates="order"
    )
    logs: Mapped[list["AuditLog"]] = relationship(
        "AuditLog",
        backref="order",
        primaryjoin=and_(
            id == foreign(AuditLog.parent_id), AuditLog.parent_type == "order"
        ),
        order_by="AuditLog.created_at.desc()",
    )


class OrderProduct(Base):
    __tablename__ = "order_products"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)

    points: Mapped[int] = mapped_column(nullable=False)
    qty: Mapped[int] = mapped_column(nullable=False)

    order: Mapped[Order] = relationship("Order", back_populates="order_products")
    product: Mapped["Product"] = relationship("Product", backref="order_products")
