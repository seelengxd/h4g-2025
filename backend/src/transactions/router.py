
from src.transactions.models import Transaction
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.common.dependencies import get_session

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/")
def get_all_transactions(
    session: Annotated[Session, Depends(get_session)],
) -> list[Transaction]:
    transactions = session.scalars(select(Transaction)).all()
    return transactions