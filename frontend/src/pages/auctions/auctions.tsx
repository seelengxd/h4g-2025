import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NewAuctionFormDialog from "@/features/auctions/new-auction-form";
import { getAuctions } from "@/features/auctions/queries";
import ProductImage from "@/features/products/product-image";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { ListPlus } from "lucide-react";
import { Link } from "react-router";

const Auctions = () => {
  const { user } = useCombinedStore((store) => store);
  const { data: auctions, isLoading } = useQuery(getAuctions());

  if (!user) {
    return;
  }

  if (isLoading || !auctions) {
    return;
  }

  const isStaff = user.role !== "resident";
  console.log({ auctions });
  return (
    <>
      <div className="sticky top-0 bg-white">
        <div className="flex justify-between">
          <h1 className="text-2xl font-light">
            {isStaff ? "Manage auctions" : "Auctions"}
          </h1>
          {isStaff && (
            <NewAuctionFormDialog>
              <Button>
                <ListPlus /> Add auction
              </Button>
            </NewAuctionFormDialog>
          )}
        </div>
        <hr className="my-4" />
      </div>
      <div className="flex flex-col gap-2">
        {auctions.map((auction) => (
          <Link to={`/auctions/${auction.id}`} key={auction.id}>
            <Card key={auction.id} className="flex gap-4 p-4">
              <ProductImage product={auction.product} />
              <div className="flex flex-col gap-1 py-2">
                <h3>
                  Auction for{" "}
                  <span className="italic">{auction.product.name}</span>
                </h3>
                <p>Started on {format(auction.created_at, "dd MMM")}</p>
                <Badge className="w-fit">
                  {auction.completed ? "Completed" : "Ongoing"}
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Auctions;
