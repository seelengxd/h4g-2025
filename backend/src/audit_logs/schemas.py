from datetime import datetime
from pydantic import BaseModel, ConfigDict

from src.auth.schemas_base import MiniUserPublic


class AuditLogPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    parent_type: str
    parent_id: int
    user_id: int
    log_user: MiniUserPublic
    action: str
    created_at: datetime
