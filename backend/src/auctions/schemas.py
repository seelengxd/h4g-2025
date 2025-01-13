from pydantic import BaseModel


class BidCreate(BaseModel):
    bid: int
