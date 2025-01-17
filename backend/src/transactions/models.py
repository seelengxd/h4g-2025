from sqlalchemy import ForeignKey, and_
from src.auctions.models import Bid
from src.auth.models import User
from src.common.base import Base


class TransactionState(str, Enum):
    APPROVED = "approved"
    REJECTED = "rejected"
    PENDING = "pending"

    def __str__(self):
        return self.value.title()


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)

    # user that purchased the product/requested voucher
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    parent_type: Mapped[str] = mapped_column(nullable=False)  # ORDER | VOUCHER
    parent_id: Mapped[int] = mapped_column(nullable=False)

    state: Mapped[TransactionState] = mapped_column(
        default=TransactionState.PENDING, nullable=False
    )

    # RELATIONSHIPS
    user: Mapped[User] = relationship("User", backref="transactions")


class OrderTransaction(Transaction):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "order",
    }


class VoucherTransaction(Transaction):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "voucher",
    }
