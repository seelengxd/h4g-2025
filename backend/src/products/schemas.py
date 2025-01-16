from pydantic import BaseModel, ConfigDict

from src.audit_logs.schemas import AuditLogPublic
from src.products.models import Category


class MiniProductPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: Category
    name: str
    image: str | None = None
    points: int
    total_qty: int


class ProductPublic(MiniProductPublic):
    logs: list["AuditLogPublic"]


class ProductCreate(BaseModel):
    category: Category
    name: str
    image: str | None = None
    points: int
    total_qty: int
