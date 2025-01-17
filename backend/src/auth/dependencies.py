from http import HTTPStatus
from typing import Annotated, Optional
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi import Cookie, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload, joinedload
from src.auctions.models import Bid
from src.audit_logs.models import AuditLog
from src.common.database import engine
from src.orders.models import Order, OrderProduct
from src.voucher_task.models import TaskUser
from .models import Role, User
from src.transactions.models import Transaction

import jwt
from jwt.exceptions import InvalidTokenError
from src.common.constants import SECRET_KEY


class OAuth2IgnoreError(OAuth2PasswordBearer):
    """Ignore HTTP error because we want to accept cookie auth too"""

    async def __call__(self, request: Request) -> Optional[str]:
        try:
            return await super().__call__(request)
        except HTTPException:
            return ""


# This url = login post url
oauth2_scheme = OAuth2IgnoreError(tokenUrl="/auth/login")


ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080

##################
# Password utils #
##################

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str):
    with Session(engine) as session:
        user = session.scalars(
            select(User)
            .where(User.username == username)
            .options(
                joinedload(User.transactions)
                .joinedload(Transaction.order)
                .joinedload(Order.logs)
                .joinedload(AuditLog.log_user),
                joinedload(User.transactions)
                .joinedload(Transaction.order)
                .joinedload(Order.order_products)
                .joinedload(OrderProduct.product),
                joinedload(User.transactions)
                .joinedload(Transaction.order)
                .joinedload(Order.user),
                joinedload(User.transactions)
                .joinedload(Transaction.task_user)
                .joinedload(TaskUser.task),
                joinedload(User.transactions)
                .joinedload(Transaction.bid)
                .joinedload(Bid.auction),
                joinedload(User.transactions)
                .joinedload(Transaction.bid)
                .joinedload(Bid.user),
            )
        ).first()
        if not user:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail={"error": "Invalid username.", "error_id": "1"},
            )
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail={"error": "Incorrect password.", "error_id": "2"},
            )
        return user


###############
#  jwt utils  #
###############


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


###################
# auth dependency #
###################


async def add_current_user(
    request: Request,
    token: Annotated[str | None, Depends(oauth2_scheme)],
    session: Annotated[str | None, Cookie()] = None,
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = token or session
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("sub")
        with Session(engine) as session:
            user = session.scalar(
                select(User)
                .where(User.id == int(id))
                .options(
                    joinedload(User.transactions)
                    .joinedload(Transaction.order)
                    .joinedload(Order.logs)
                    .joinedload(AuditLog.log_user),
                    joinedload(User.transactions)
                    .joinedload(Transaction.order)
                    .joinedload(Order.order_products)
                    .joinedload(OrderProduct.product),
                    joinedload(User.transactions)
                    .joinedload(Transaction.order)
                    .joinedload(Order.user),
                    joinedload(User.transactions)
                    .joinedload(Transaction.task_user)
                    .joinedload(TaskUser.task),
                    joinedload(User.transactions)
                    .joinedload(Transaction.task_user)
                    .joinedload(TaskUser.user),
                    joinedload(User.transactions)
                    .joinedload(Transaction.bid)
                    .joinedload(Bid.auction),
                    joinedload(User.transactions)
                    .joinedload(Transaction.bid)
                    .joinedload(Bid.user),
                )
            )

        if not user:
            raise InvalidTokenError()

        request.state.user = user

    except InvalidTokenError:
        raise credentials_exception


async def get_current_user(
    request: Request,
):
    return request.state.user


async def must_be_staff(user: Annotated[User, Depends(get_current_user)]):
    if user.role not in (Role.ADMIN, Role.STAFF):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action",
        )
    return user
