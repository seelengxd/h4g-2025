from enum import Enum
from sqlalchemy import and_, ForeignKey
from src.audit_logs.models import AuditLog
from src.common.base import Base
from src.auth.models import User
from sqlalchemy.orm import Mapped, relationship, mapped_column, foreign


class VoucherTask(Base):
    __tablename__ = "voucher_tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    task_name: Mapped[str] = mapped_column(nullable=False)
    points: Mapped[int] = mapped_column(nullable=False)
    hidden: Mapped[bool] = mapped_column(server_default="false", nullable=False)

    task_users: Mapped[list["TaskUser"]] = relationship(
        "TaskUser", back_populates="task"
    )

    logs: Mapped[list["AuditLog"]] = relationship(
        "AuditLog",
        backref="voucher",
        primaryjoin=and_(
            id == foreign(AuditLog.parent_id), AuditLog.parent_type == "voucher"
        ),
        order_by="AuditLog.created_at.desc()",
    )


## ------------ task user table ------------ ##
class RequestState(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

    def str(self):
        return self.value.title()


class TaskUser(Base):
    __tablename__ = "task_users"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    task_id: Mapped[int] = mapped_column(ForeignKey("voucher_tasks.id"), nullable=False)
    state: Mapped[RequestState] = mapped_column(
        default=RequestState.PENDING, nullable=False
    )

    user: Mapped[User] = relationship("User", backref="tasks_users")
    task: Mapped[VoucherTask] = relationship("VoucherTask", back_populates="task_users")
