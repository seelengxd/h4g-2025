from datetime import datetime
from pydantic import BaseModel, ConfigDict

from src.auctions.schemas import BidPublic
from src.orders.schemas import OrderPublic
from src.voucher_task.schema import MiniTaskUserPublic


class BaseTransactionPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    amount: int
    parent_id: int
    parent_type: str

    created_at: datetime


class BidTransactionPublic(BaseTransactionPublic):
    bid: BidPublic


class OrderTransactionPublic(BaseTransactionPublic):
    order: OrderPublic


class VoucherTaskTransactionPublic(BaseTransactionPublic):
    task_user: MiniTaskUserPublic


type TransactionPublic = (
    BaseTransactionPublic
    | BidTransactionPublic
    | OrderTransactionPublic
    | VoucherTaskTransactionPublic
)
