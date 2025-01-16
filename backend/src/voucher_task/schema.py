from datetime import datetime
from pydantic import BaseModel, ConfigDict

from src.auth.schemas_base import MiniUserPublic
from src.voucher_task.models import RequestState


class VoucherTaskPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    task_name: str
    points: int
    task_users: list["TaskUserPublic"]
    created_at: datetime
    updated_at: datetime


class TaskUserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
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
