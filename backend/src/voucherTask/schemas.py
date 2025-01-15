from datetime import datetime
from pydantic import BaseModel, ConfigDict
from src.audit_logs.schemas import AuditLogPublic
from src.auth.schemas import UserPublic

# may consider adding a state: available | not available
# may need to add a delete too
class MiniVoucherTaskPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    task_name: str
    points: int

class VoucherTaskPublic(MiniVoucherTaskPublic):
    logs: list[AuditLogPublic]

class VoucherTaskCreate(BaseModel):
    task_name: str 
    points: int

#used to update points/name
class VoucherTaskUpdate(BaseModel):
    points: int
    task_name: str


## ------------ task user table ------------ ##
class MiniTaskUserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user_id: int
    task_id: int
    user: UserPublic
    task: VoucherTaskPublic

class TaskUserPublic(MiniTaskUserPublic):
    logs: list[AuditLogPublic]
