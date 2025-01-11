import random
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from src.auth.dependencies import get_password_hash, must_be_staff
from src.common.dependencies import get_session
from src.auth.models import Role, User
from src.auth.schemas import UserCreate, UserPublic, UserUpdate
from sqlalchemy.orm import Session
from string import ascii_letters, digits


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/")
def get_all_users(
    session: Annotated[Session, Depends(get_session)],
) -> list[UserPublic]:
    users = session.scalars(select(User).where(User.role == Role.RESIDENT)).all()
    return users


@router.post("/")
def create_user(
    data: UserCreate,
    session: Annotated[Session, Depends(get_session)],
) -> str:
    random_password = "".join(random.choices(ascii_letters + digits, k=8))

    new_user = User(
        username=data.username,
        full_name=data.full_name,
        hashed_password=get_password_hash(random_password),
        suspended=False,
        image=data.image,
    )
    session.add(new_user)
    session.commit()

    return random_password


@router.get("/{user_id}")
def get_user(
    user_id: int, session: Annotated[Session, Depends(get_session)]
) -> UserPublic:
    user = session.scalar(select(User).where(User.id == user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdate,
    session: Annotated[Session, Depends(get_session)],
):
    user = session.scalar(select(User).where(User.id == user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.full_name = data.full_name
    user.suspended = data.suspended
    user.role = data.role
    user.username = data.username
    if data.image:
        user.image = data.image
    if data.password is not None:
        user.hashed_password = get_password_hash(data.password)

    session.commit()
    return user
