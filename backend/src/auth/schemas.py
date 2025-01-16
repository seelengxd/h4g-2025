from pydantic import BaseModel
from src.auth.schemas_base import MiniUserPublic
from src.transactions.schemas import (
    BidTransactionPublic,
    OrderTransactionPublic,
    VoucherTaskTransactionPublic,
)


class UserPublic(MiniUserPublic):
    points: int
    suspended: bool
    transactions: list[
        BidTransactionPublic | OrderTransactionPublic | VoucherTaskTransactionPublic
    ]


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserPublic
