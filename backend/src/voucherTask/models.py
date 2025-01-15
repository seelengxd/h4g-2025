from sqlalchemy import and_, ForeignKey
from src.audit_logs.models import AuditLog
from src.common.base import Base
from src.auth.models import User
from sqlalchemy.orm import Mapped, relationship, mapped_column, foreign


class VoucherTask(Base):
    __tablename__ = "voucherTasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    task_name: Mapped[str] = mapped_column(nullable=False) 
    points: Mapped[int] = mapped_column(nullable=False)

    logs: Mapped[list["AuditLog"]] = relationship(
        "AuditLog",
        backref="voucher",
        primaryjoin=and_(
            id == foreign(AuditLog.parent_id), AuditLog.parent_type == "voucher"
        ),
        order_by="AuditLog.created_at.desc()",
    )

## ------------ task user table ------------ ##
class TaskUser(Base):
    __tablename__ = "tasksUsers"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    task_id: Mapped[int] = mapped_column(ForeignKey("voucherTasks.id"), nullable=False)

    user: Mapped[User] = relationship("User", backref="tasksUsers")
    task: Mapped[VoucherTask] = relationship("VoucherTask", backref="tasksUsers")

    logs: Mapped[list["AuditLog"]] = relationship(
        "AuditLog",
        backref="tasksUsers",
        primaryjoin=and_(
            id == foreign(AuditLog.parent_id), AuditLog.parent_type == "voucher"
        ),
        order_by="AuditLog.created_at.desc()",
    )