from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm

from src.auth.dependencies import authenticate_user
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
