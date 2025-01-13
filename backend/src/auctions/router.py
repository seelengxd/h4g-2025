from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.auctions.models import Auction, Bid
from src.auctions.schemas import BidCreate
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session


router = APIRouter(path="/auctions", tags=["auctions"])


@router.get("/")
def get_all_auctions(
    session: Annotated[Session, Depends(get_session)],
):
    auctions = session.scalars(
        select(Auction)
        .order_by(Auction.id.desc())
        .options(selectinload(Auction.bids, Bid.user))
    ).all()
    return auctions


@router.get("/{auction_id}")
def get_auction(
    auction_id: int,
    session: Annotated[Session, Depends(get_session)],
):
    auction = session.scalar(
        select(Auction)
        .where(Auction.id == auction_id)
        .options(selectinload(Auction.bids, Bid.user))
    )

    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")

    return auction


@router.post("/{auction_id}/bids")
def make_bid(
    auction_id: int,
    session: Annotated[Session, Depends(get_session)],
    user: Annotated[User, Depends(get_current_user)],
    data: BidCreate,
):
    auction = session.scalar(
        select(Auction)
        .where(Auction.id == auction_id)
        .options(selectinload(Auction.bids, Bid.user))
    )

    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")

    if auction.completed:
        raise HTTPException(status_code=400, detail="Auction is completed")

    if data.bid < auction.reserve_price:
        raise HTTPException(status_code=400, detail="Bid is lower than reserve price")

    # get the highest bid amount
    highest_bid = max([bid.points for bid in auction.bids], default=0)
    if data.bid < highest_bid:
        raise HTTPException(
            status_code=400, detail=f"Bid is lower than highest bid [{highest_bid}]"
        )

    bid = session.scalar(
        select(Bid).where(Bid.user_id == user.id, Bid.auction_id == auction_id)
    )
    if not bid:
        bid = Bid(user_id=user.id, auction_id=auction_id, points=data.bid)

    bid.points = data.bid
    session.add(bid)
    session.commit()

    return bid
