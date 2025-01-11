from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.common.dependencies import get_session
from src.products.models import Product
from src.products.schemas import ProductCreate, ProductPublic


router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def get_all_products(
    session: Annotated[Session, Depends(get_session)],
) -> list[ProductPublic]:
    products = session.scalars(select(Product)).all()
    return products


@router.get("/{product_id}")
def get_product(
    product_id: int, session: Annotated[Session, Depends(get_session)]
) -> ProductPublic:
    product = session.scalar(select(Product).where(Product.id == product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/")
def create_product(
    data: ProductCreate, session: Annotated[Session, Depends(get_session)]
) -> ProductPublic:
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
) -> ProductPublic:
    product = session.scalar(select(Product).where(Product.id == product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.update(data.model_dump(exclude_unset=True))
    session.add(product)
    session.commit()
    session.refresh(product)
    return product
