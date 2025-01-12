from pydantic import BaseModel, ConfigDict, Field

from src.orders.models import OrderState
from src.products.schemas import ProductPublic


class OrderPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_products: list["OrderProductPublic"]
    state: OrderState


class OrderProductPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product: ProductPublic
    points: int
    qty: int


class OrderProductCreate(BaseModel):
    product_id: int
    qty: int


class OrderCreate(BaseModel):
    order_products: list[OrderProductCreate] = Field(min_length=1)


class OrderUpdate(BaseModel):
    state: OrderState
