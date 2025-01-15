from datetime import datetime
from pydantic import BaseModel

from src.auth.schemas import UserPublic


class MiniReportPublic(BaseModel):

    id: int
    generated_date: datetime
    pdf_file_path: str # only store file path on local, and staff can only access report they generated
    user_id: int
    user: UserPublic