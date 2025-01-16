from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.orders.schemas import MiniOrderPublic
from src.orders.models import Order, OrderProduct

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/")
def get_all_reports(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[MiniOrderPublic]:
    
    """ Fetch order data for report, only staff accessible """
    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Access forbidden: Staff only.")

    query = (
        select(Order)
        .order_by(Order.id.desc())
        .options(selectinload(Order.order_products, OrderProduct.product))
    )

    orders = session.scalars(query).all()

    return orders

# @router.get("/")
# def get_reports():
#     # Fetch and return report-specific data
#     return {"reports": []}
