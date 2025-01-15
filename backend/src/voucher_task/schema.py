from datetime import datetime
from pydantic import BaseModel

from src.auth.schemas import MiniUserPublic
from src.voucher_task.models import RequestState


class VoucherTaskPublic(BaseModel):
    id: int
    task_name: str
    points: int
    task_users: list["TaskUserPublic"]
    created_at: datetime
    updated_at: datetime


class TaskUserPublic(BaseModel):
    id: int
    user: MiniUserPublic
    state: RequestState
    created_at: datetime
    updated_at: datetime


class VoucherTaskCreate(BaseModel):
    task_name: str
    points: int
    task_users: list[int] | None


class VoucherTaskUpdate(BaseModel):
    task_name: str
    points: int


class ApprovalUpdate(BaseModel):
    task_user_ids: list[int]
