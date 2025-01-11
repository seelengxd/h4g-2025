from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm

from src.auth.schemas import UserPublic
from src.auth.dependencies import authenticate_user, get_current_user
from src.auth.utils import create_token, Token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def log_in(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response
) -> Token:
    try:
        user = authenticate_user(form_data.username, form_data.password)
    except HTTPException as exc:
        raise exc

    return create_token(user, response)


@router.get("/logout")
def logout(response: Response):
    response.delete_cookie(key="session")
    return ""


authenticated_router = APIRouter(prefix="/auth", tags=["auth"])


@authenticated_router.get("/session")
def get_user(user: Annotated[UserPublic, Depends(get_current_user)]) -> UserPublic:
    return UserPublic.model_validate(user)
