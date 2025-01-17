from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from src.audit_logs.schemas import AuditLogPublic
from src.auth.schemas_base import MiniUserPublic
from src.orders.models import OrderState
from src.products.schemas import MiniProductPublic


class MiniOrderPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_products: list["OrderProductPublic"]
    state: OrderState
    user: MiniUserPublic
    created_at: datetime


class OrderPublic(MiniOrderPublic):
    logs: list[AuditLogPublic]


class OrderProductPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product: MiniProductPublic
    points: int
    qty: int


class OrderProductCreate(BaseModel):
    product_id: int
    qty: int


class OrderCreate(BaseModel):
    order_products: list[OrderProductCreate] = Field(min_length=1)


class OrderUpdate(BaseModel):
    state: OrderState
