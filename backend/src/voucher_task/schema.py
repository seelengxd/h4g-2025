from datetime import datetime
from pydantic import BaseModel, ConfigDict

from src.auth.schemas_base import MiniUserPublic
from src.voucher_task.models import RequestState


class MiniVoucherTaskPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    task_name: str
    points: int
    task_users: list["MiniTaskUserPublic"]
    created_at: datetime
    updated_at: datetime
    description: str | None = None


class VoucherTaskPublic(MiniVoucherTaskPublic):
    pass


class MiniTransactionPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    """only used for voucher task"""

    amount: int


class MiniTaskUserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    task_id: int
    user: MiniUserPublic
    state: RequestState
    created_at: datetime
    updated_at: datetime
    justification: str | None = None

    transactions: list[MiniTransactionPublic]


class TaskUserPublic(MiniTaskUserPublic):
    transactions: list[MiniTransactionPublic]


class VoucherTaskCreate(BaseModel):
    task_name: str
    points: int
    description: str | None = None
    task_users: list[int] | None


class VoucherTaskUpdate(BaseModel):
    task_name: str
    points: int
    description: str | None = None


class ApprovalUpdate(BaseModel):
    task_user_ids: list[int]


class VoucherTaskJoinRequest(BaseModel):
    justification: str | None = None


class VoucherTaskRequestCreate(BaseModel):
    user_ids: list[int]
    justification: str | None = None
    state: RequestState
