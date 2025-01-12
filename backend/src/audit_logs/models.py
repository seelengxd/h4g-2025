from sqlalchemy import ForeignKey
from src.auth.models import User
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(primary_key=True)

    parent_type: Mapped[str]
    parent_id: Mapped[int]

    # The user who performed the action that caused this audit log.
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    action: Mapped[str]

    log_user: Mapped[User] = relationship("User", backref="audit_logs")


class OrderAuditLog(AuditLog):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "order",
    }


class ProductAuditLog(AuditLog):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "product",
    }
