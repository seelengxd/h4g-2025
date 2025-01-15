from datetime import datetime
from pydantic import BaseModel, ConfigDict

from src.auth.schemas import UserPublic
from src.transactions.models import TransactionState


class TransactionPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    parent_type: str
    parent_id: int
    user_id: int
    points: int
    state: TransactionState
    user: UserPublic
