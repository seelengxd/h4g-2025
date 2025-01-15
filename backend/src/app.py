from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware


import logging

from fastapi.staticfiles import StaticFiles

from src.auth.dependencies import add_current_user
from src.common.constants import FRONTEND_URL
from src.auth import router as auth
from src.users import router as users
from src.files import router as files
from src.products import router as products
from src.orders import router as orders
from src.auctions import router as auctions
from src.transactions import router as transactions
from src.voucherTask import router as voucherTask
from src.reports import router as reports


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

server.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
server.include_router(auth.router)

authenticated_router = APIRouter(prefix="", dependencies=[Depends(add_current_user)])
authenticated_router.include_router(auth.authenticated_router)
authenticated_router.include_router(users.router)
authenticated_router.include_router(files.router)
authenticated_router.include_router(products.router)
authenticated_router.include_router(orders.router)
authenticated_router.include_router(auctions.router)
authenticated_router.include_router(transactions.router)
authenticated_router.include_router(voucherTask.router)
authenticated_router.include_router(reports.router)

server.include_router(authenticated_router)
