import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getAuction,
  useCloseAuction,
  useCreateBid,
} from "@/features/auctions/queries";
import ProductImage from "@/features/products/product-image";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { ChevronLeft, HammerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";

const Auction = () => {
  const { id } = useParams<"id">();
  const { data: auction, isLoading } = useQuery(getAuction(Number(id)));

  const { user } = useCombinedStore((store) => store);

  const closeAuctionMutation = useCloseAuction(Number(id));
  const createBidMutation = useCreateBid(Number(id));

  // for bid form
  const [bidPoints, setBidPoints] = useState(0);

  useEffect(() => {
    if (auction) {
      setBidPoints(
        Math.max(
          auction.reserve_price + 1,
          (currentBid?.points ?? 0) + 1,
          bidPoints
        )
      );
    }
  }, [auction]);

  const [error, setError] = useState("");

  if (isLoading || !user) {
    return null;
  }

  if (!auction) {
    return <Navigate to="/auctions" />;
  }

  const isStaff = user.role !== "resident";

  const bids = auction.bids.sort((a, b) => b.points - a.points);
  const currentBid = bids[0];
  const yourBid = bids.find((bid) => bid.user.id === user.id);

  return (
    <>
      <div className="flex justify-between">
        <Link to="/auctions">
          <Button variant={"secondary"}>
            <ChevronLeft /> Back to auctions
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 mt-4 md:flex-row">
        <ProductImage
          product={auction.product}
          className="m-auto md:m-0 w-80 h-80"
        />
        <div className="pl-4 md:border-l">
          <div className="flex items-baseline gap-4">
            <h1 className="text-2xl font-light">
              Auction for <span className="italic">{auction.product.name}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <p>Started on {format(auction.created_at, "dd MMM")}</p>
            <Badge variant={auction.completed ? "secondary" : "green"}>
              {auction.completed ? "Completed" : "Ongoing"}
            </Badge>
          </div>

          <div className="mt-4">
            <p>Current bid</p>
            <p>{currentBid ? currentBid.points : "-"}</p>
          </div>
          <div>
            <p>Your bid</p>
            <p>{yourBid ? yourBid.points : "-"}</p>
          </div>
          {isStaff && !auction.completed && (
            <Button
              onClick={() => closeAuctionMutation.mutate()}
              className="mt-4"
            >
              <HammerIcon />
              Complete Auction
            </Button>
          )}
          {!isStaff && !auction.completed && (
            <div className="flex flex-col gap-2 mt-4">
              <Input
                key={Math.max(auction.reserve_price, currentBid?.points ?? 0)}
                type="number"
                value={bidPoints}
                defaultValue={
                  (currentBid?.points ?? auction.reserve_price - 1) + 1
                }
                onChange={(e) => setBidPoints(Number(e.target.value))}
              ></Input>
              <Button
                onClick={() => createBidMutation.mutate({ bid: bidPoints })}
              >
                Make bid
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="pl-4 mt-4">
        <h3 className="font-semibold">Bids</h3>
        <div className="flex flex-col gap-2">
          {bids.length === 0 && <p>No bids yet</p>}
          {bids.map((bid, index) => (
            <Card key={bid.id} className="p-2">
              <p>
                {index + 1}. {bid.user.full_name} - {bid.points} pts
              </p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Auction;
