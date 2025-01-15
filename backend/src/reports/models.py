from src.auth.models import User
from src.common.base import Base
from datetime import datetime
from sqlalchemy.orm import Mapped, relationship, mapped_column, foreign
from sqlalchemy import DateTime, LargeBinary, ForeignKey



class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    generated_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    pdf_file_path: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    user: Mapped[User] = relationship("User", backref="reports")
