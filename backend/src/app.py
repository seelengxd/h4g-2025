from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware


import logging

from src.auth.dependencies import add_current_user
from src.common.constants import FRONTEND_URL
from src.auth import router as auth


logging.getLogger("passlib").setLevel(logging.ERROR)


server = FastAPI(title="Minimart Backend")

origins = [FRONTEND_URL]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

server.include_router(auth.router)

authenticated_router = APIRouter(prefix="", dependencies=[Depends(add_current_user)])
server.include_router(authenticated_router)
