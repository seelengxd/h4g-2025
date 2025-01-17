from datetime import datetime
from pydantic import BaseModel

from src.auth.schemas import UserPublic
from src.products.models import Category


class MiniReportPublic(BaseModel):
    id: int
    generated_date: datetime
    pdf_file_path: str  # only store file path on local, and staff can only access report they generated
    user_id: int
    user: UserPublic


class InventorySummaryReportRowOrder(BaseModel):
    order_id: int
    created_at: datetime
    user_id: int
    full_name: str
    qty: int


class InventorySummaryReportRowDetails(BaseModel):
    total: int
    orders: list[InventorySummaryReportRowOrder]


class InventorySummaryReportRow(BaseModel):
    id: int
    name: str
    category: Category
    image: str | None = None
    total_qty: int

    pending_approval: InventorySummaryReportRowDetails
    pending_claim: InventorySummaryReportRowDetails
    remaining: int