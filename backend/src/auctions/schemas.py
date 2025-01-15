from datetime import datetime
from pydantic import BaseModel

from src.auth.schemas import MiniUserPublic
from src.products.schemas import MiniProductPublic


class AuctionPublic(BaseModel):
    id: int
    product: MiniProductPublic
    bids: list["BidPublic"]
    reserve_price: int
    completed: bool
    created_at: datetime


class BidPublic(BaseModel):
    id: int
    points: int
    user: MiniUserPublic


class AuctionCreate(BaseModel):
    product_id: int
    reserve_price: int


class BidCreate(BaseModel):
    bid: int
