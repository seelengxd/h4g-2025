from sqlalchemy import ForeignKey, and_
from src.auctions.models import Bid
from src.auth.models import User
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, foreign

from src.orders.models import Order
from src.voucher_task.models import TaskUser


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    # if amount is negative, points went down (e.g. from making an order)
    amount: Mapped[int] = mapped_column(nullable=False)
    parent_id: Mapped[int] = mapped_column(nullable=False)

    # can be task_user (from voucher_task) or order or bid (from auction)
    parent_type: Mapped[str] = mapped_column(nullable=False)

    user: Mapped[User] = relationship("User", back_populates="transactions")
    bid: Mapped[Bid | None] = relationship(
        "Bid",
        backref="transactions",
        primaryjoin=and_(parent_id == foreign(Bid.id), parent_type == "bid"),
    )
    order: Mapped[Order | None] = relationship(
        "Order",
        backref="transactions",
        primaryjoin=and_(parent_id == foreign(Order.id), parent_type == "order"),
    )
    task_user: Mapped[TaskUser | None] = relationship(
        "TaskUser",
        back_populates="transactions",
        primaryjoin=and_(parent_id == foreign(TaskUser.id), parent_type == "task_user"),
    )
