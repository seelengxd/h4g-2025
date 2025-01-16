from datetime import datetime
from pydantic import BaseModel, ConfigDict

from src.auth.schemas_base import MiniUserPublic
from src.products.schemas import MiniProductPublic


class AuctionPublic(BaseModel):
    id: int
    product: MiniProductPublic
    bids: list["BidPublic"]
    reserve_price: int
    completed: bool
    created_at: datetime


class BidPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    points: int
    user: MiniUserPublic
    auction_id: int


class AuctionCreate(BaseModel):
    product_id: int
    reserve_price: int


class BidCreate(BaseModel):
    bid: int
