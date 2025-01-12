from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.orders.models import Order, OrderProduct, OrderState
from src.orders.schemas import OrderCreate, OrderPublic, OrderUpdate
from src.products.models import Product


router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/")
def get_all_orders(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[OrderPublic]:
    query = select(Order).options(
        selectinload(Order.order_products, OrderProduct.product)
    )
    if not user.role.is_staff():
        query = query.where(Order.user_id == user.id)

    orders = session.scalars(query).all()
    return orders


@router.get("/{order_id}")
def get_order(
    order_id: int,
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> OrderPublic:
    query = (
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.order_products, OrderProduct.product))
    )
    order = session.scalar(query)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if not user.role.is_staff() and order.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    return order


@router.post("/")
def create_order(
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
    data: OrderCreate,
):
    order = Order(user_id=user.id, state=OrderState.PENDING)
    products = session.scalars(
        select(Product).where(
            Product.id.in_(item.product_id for item in data.order_products)
        )
    ).all()

    if len(products) != len(data.order_products):
        raise HTTPException(status_code=404, detail="Product not found")

    mapper = {product.id: product for product in products}

    order_products = [
        OrderProduct(
            **order_product.model_dump(), points=mapper[order_product.product_id].points
        )
        for order_product in data.order_products
    ]
    order.order_products = order_products
    user.points -= sum(product.points * product.qty for product in order_products)

    session.add(order)
    session.add(user)

    session.commit()
    session.refresh(order)

    return order


@router.patch("/{order_id}")
def update_order(
    session: Annotated[Session, Depends(get_session)],
    order_id: int,
    data: OrderUpdate,
    user: Annotated[User, Depends(get_current_user)],
):
    """The only thing that may be updated is the order state."""
    order = session.scalar(select(Order).where(Order.id == order_id))
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # If the user is a resident and order is not his/not withdraw, reject the update.
    if not user.role.is_staff() and (
        order.user_id != user.id or data.state != OrderState.WITHDRAWN
    ):
        raise HTTPException(status_code=403, detail="Forbidden")

    order.state = data.state
    session.commit()
    session.refresh(order)

    return order
