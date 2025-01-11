from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum


class Role(str, Enum):
    RESIDENT = "resident"
    STAFF = "staff"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    role: Mapped[Role] = mapped_column(default=Role.RESIDENT, nullable=False)

    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    image: Mapped[str | None] = mapped_column(nullable=True)

    full_name: Mapped[str] = mapped_column(nullable=False)

    points: Mapped[int] = mapped_column(server_default="0", nullable=False)
    suspended: Mapped[bool] = mapped_column(server_default="false", nullable=False)
