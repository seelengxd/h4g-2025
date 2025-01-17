from datetime import datetime
from pydantic import BaseModel, ConfigDict

from src.audit_logs.schemas import AuditLogPublic
from src.auth.schemas_base import MiniUserPublic
from src.orders.models import OrderState
from src.products.models import Category


class MiniProductPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: Category
    name: str
    image: str | None = None
    points: int
    total_qty: int


class ProductTransactionPublic(BaseModel):
    """This is scuffed, but its actually order product (but from product pov instead of orders)"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    user: "MiniUserPublic"
    order_state: OrderState
    points: int
    qty: int
    created_at: datetime


class ProductPublic(MiniProductPublic):
    logs: list["AuditLogPublic"]

    order_products: list["ProductTransactionPublic"]


class ProductCreate(BaseModel):
    category: Category
    name: str
    image: str | None = None
    points: int
    total_qty: int
