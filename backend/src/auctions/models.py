from sqlalchemy import ForeignKey
from src.auth.models import User
from src.common.base import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.products.models import Product


class Auction(Base):
    __tablename__ = "auctions"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    completed: Mapped[bool]
    reserve_price: Mapped[int]

    bids: Mapped[list["Bid"]] = relationship(
        "Bid", order_by="Bid.points.desc()", back_populates="auction"
    )

    product: Mapped["Product"] = relationship("Product", backref="auctions")


class Bid(Base):
    __tablename__ = "bids"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    points: Mapped[int]
    auction_id: Mapped[int] = mapped_column(ForeignKey("auctions.id"), nullable=False)

    auction: Mapped[Auction] = relationship("Auction", back_populates="bids")
    user: Mapped[User] = relationship("User", backref="bids")
