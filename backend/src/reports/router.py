from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.reports.schemas import MiniReportPublic
from src.reports.models import Report


router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/")
def get_all_reports(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[MiniReportPublic]:
    
    # If the user is admin, allow this action, else forbidden.
    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Forbidden")
    
    reports = session.scalars(select(Report)
                              .where(Report.user_id == user.id)
                              .order_by(Report.generated_date.desc())).all()
    return reports


