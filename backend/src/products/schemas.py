from pydantic import BaseModel

from src.products.models import Category


class ProductPublic(BaseModel):
    id: int
    category: Category
    name: str
    image: str | None = None
    points: int
    total_qty: int


class ProductCreate(BaseModel):
    category: Category
    name: str
    image: str | None = None
    points: int
    total_qty: int
