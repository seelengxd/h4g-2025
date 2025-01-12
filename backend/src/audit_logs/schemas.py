from datetime import datetime
from pydantic import BaseModel

from src.auth.schemas import UserPublic


class AuditLogPublic(BaseModel):
    id: int
    parent_type: str
    parent_id: int
    user_id: int
    log_user: UserPublic
    action: str
    created_at: datetime
