from enum import Enum
from typing import TYPE_CHECKING
from sqlalchemy import and_, ForeignKey
from src.audit_logs.models import AuditLog
from src.common.base import Base
from src.auth.models import User
from sqlalchemy.orm import Mapped, relationship, mapped_column, foreign

if TYPE_CHECKING:
    from src.transactions.models import Transaction


class VoucherTask(Base):
    __tablename__ = "voucher_tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    task_name: Mapped[str] = mapped_column(nullable=False)
    points: Mapped[int] = mapped_column(nullable=False)
    hidden: Mapped[bool] = mapped_column(server_default="false", nullable=False)
    description: Mapped[str | None] = mapped_column(nullable=True)

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
    justification: Mapped[str | None] = mapped_column(nullable=True)

    user: Mapped[User] = relationship("User", backref="task_users")
    task: Mapped[VoucherTask] = relationship("VoucherTask", back_populates="task_users")

    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction",
        back_populates="task_user",
        primaryjoin="and_(foreign(TaskUser.id) == Transaction.parent_id, Transaction.parent_type == 'task_user')",
        order_by="Transaction.created_at.desc()",
        uselist=True,
    )
