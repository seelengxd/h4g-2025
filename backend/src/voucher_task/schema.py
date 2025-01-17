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
    description: str | None = None


class TaskUserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    task_id: int
    user: MiniUserPublic
    state: RequestState
    created_at: datetime
    updated_at: datetime
    justification: str | None = None


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
