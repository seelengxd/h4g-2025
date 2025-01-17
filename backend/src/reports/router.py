from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.orders.schemas import MiniOrderPublic
from src.orders.models import Order, OrderProduct
from src.products.models import Product
from src.reports.schemas import (
    InventorySummaryReportRow,
    InventorySummaryReportRowDetails,
    InventorySummaryReportRowOrder,
)

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/")
def get_all_reports(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[MiniOrderPublic]:
    """Fetch order data for report, only staff accessible"""
    if not user.role.is_staff():
        raise HTTPException(status_code=403, detail="Access forbidden: Staff only.")

    query = (
        select(Order)
        .order_by(Order.id.desc())
        .options(selectinload(Order.order_products, OrderProduct.product))
    )

    orders = session.scalars(query).all()

    return orders


@router.get("/inventory-summary-report")
def get_inventory_summary_report(
    session: Annotated[Session, Depends(get_session)],
) -> list[InventorySummaryReportRow]:
    products = session.scalars(
        select(Product).options(
            selectinload(Product.order_products, OrderProduct.order)
        )
    ).all()
    result = []
    for product in products:
        row = InventorySummaryReportRow(
            id=product.id,
            name=product.name,
            category=product.category,
            image=product.image,
            total_qty=product.total_qty,
            pending_approval=InventorySummaryReportRowDetails(total=0, orders=[]),
            pending_claim=InventorySummaryReportRowDetails(total=0, orders=[]),
            remaining=0,
        )

        for order_product in product.order_products:
            if order_product.order.state == "pending":
                row.pending_approval.total += order_product.qty
                row.pending_approval.orders.append(
                    InventorySummaryReportRowOrder(
                        order_id=order_product.order.id,
                        user_id=order_product.order.user_id,
                        qty=order_product.qty,
                        full_name=order_product.order.user.full_name,
                        created_at=order_product.order.created_at,
                    )
                )
            elif order_product.order.state == "approved":
                row.pending_claim.total += order_product.qty
                row.pending_claim.orders.append(
                    InventorySummaryReportRowOrder(
                        order_id=order_product.order.id,
                        user_id=order_product.order.user_id,
                        qty=order_product.qty,
                        full_name=order_product.order.user.full_name,
                        created_at=order_product.order.created_at,
                    )
                )

        row.remaining = (
            product.total_qty - row.pending_approval.total - row.pending_claim.total
        )
        result.append(row)

    return result


# @router.get("/")
# def get_reports():
#     # Fetch and return report-specific data
#     return {"reports": []}
