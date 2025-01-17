from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.audit_logs.models import AuditLog
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.orders.models import Order, OrderProduct
from src.products.models import Product
from src.products.schemas import ProductCreate, MiniProductPublic, ProductPublic


router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def get_all_products(
    session: Annotated[Session, Depends(get_session)],
) -> list[MiniProductPublic]:
    products = session.scalars(select(Product)).all()
    return products


@router.get("/{product_id}")
def get_product(
    product_id: int, session: Annotated[Session, Depends(get_session)]
) -> ProductPublic:
    product = session.scalar(
        select(Product)
        .where(Product.id == product_id)
        .options(
            selectinload(Product.logs),
            selectinload(Product.order_products, OrderProduct.order, Order.user),
        )
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/")
def create_product(
    data: ProductCreate, session: Annotated[Session, Depends(get_session)]
) -> MiniProductPublic:
    product = Product(**data.model_dump(exclude_unset=True))
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.put("/{product_id}")
def update_product(
    product_id: int,
    data: ProductCreate,
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> MiniProductPublic:
    product = session.scalar(select(Product).where(Product.id == product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    dump = data.model_dump(exclude_unset=True)

    # construct the product_log
    changes = []
    nicer_words = {
        "points": "cost",
        "total_qty": "quantity",
    }

    for key, value in dump.items():
        if getattr(product, key) != value:
            message = (
                "changed image"
                if key == "image"
                else f"changed {nicer_words.get(key, key)} from {getattr(product, key)} to {value}"
            )

            changes.append(message)

    if changes:
        if len(changes) > 1:
            changes[-1] = "and " + changes[-1]
        message = f"{user.full_name}  {', '.join(changes).replace(', and', ' and')}."
        product_log = AuditLog(
            parent_type="product",
            parent_id=product.id,
            user_id=user.id,
            action=message,
        )
        session.add(product_log)

    product.update(**dump)
    session.add(product)

    session.commit()
    session.refresh(product)
    return product
