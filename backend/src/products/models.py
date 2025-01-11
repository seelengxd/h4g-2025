from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum


class Category(str, Enum):
    FOOD = "food"
    NONFOOD = "nonfood"
    SPECIAL = "special"


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    category: Mapped[Category] = mapped_column(nullable=False)
    image: Mapped[str | None] = mapped_column(nullable=True)
    points: Mapped[int] = mapped_column(nullable=False)
    total_qty: Mapped[int] = mapped_column(nullable=False)
