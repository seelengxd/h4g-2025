import { MiniOrderPublic } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import ProductImage from "@/features/products/product-image";
import { cn } from "@/lib/utils";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { format } from "date-fns";
import { Banknote } from "lucide-react";
import { Link } from "react-router";

type OwnProps = {
  order: MiniOrderPublic;
};

const OrderCard: React.FC<OwnProps> = ({ order }) => {
  const user = useCombinedStore((store) => store.user);
  if (!user) {
    return;
  }

  const totalCost = order.order_products.reduce(
    (acc, orderProduct) => acc + orderProduct.product.points * orderProduct.qty,
    0
  );

  return (
    <Link to={`/orders/${order.id}`}>
      <div className="flex flex-col w-full p-4 border rounded-xl cursor-pointer hover:opacity-80">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Request #{order.id}{" "}
            {user.role !== "resident" && (
              <span>
                by <span className="font-medium">{order.user.full_name}</span>
              </span>
            )}
          </p>
          <Badge
            variant="secondary"
            className={cn(
              "capitalize",
              order.state === "pending" && "bg-amber-100 text-amber-900",
              order.state === "claimed" && "bg-green-100 text-green-900",
              order.state === "rejected" && "bg-red-100 text-red-900",
              order.state === "approved" && "bg-blue-100 text-blue-900"
            )}
          >
            {order.state}
          </Badge>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col">
          {order.order_products.map((orderProduct) => (
            <div className="flex items-start h-28">
              <ProductImage
                product={orderProduct.product}
                className="h-24 w-24 min-h-24 min-w-24"
              />
              <div className="flex flex-col ml-6 w-full">
                <p className="mb-1 line-clamp-1 overflow-ellipsis">
                  {orderProduct.product.name}
                </p>
                <div className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground line-clamp-1">
                    {orderProduct.product.points} points
                  </span>
                  <span>x {orderProduct.qty}</span>
                </div>
                <Separator className="my-2" />
                <span className="text-sm text-muted-foreground">
                  Total: {orderProduct.product.points * orderProduct.qty} points
                </span>
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center">
          <div className="flex items-center">
            <Banknote className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>
              Total: <span className="font-medium">{totalCost} points</span>
            </span>
          </div>
          <Separator orientation="vertical" className="mx-4 h-4" />
          <div>
            <span className="text-sm text-muted-foreground">
              Request made at {format(order.created_at, "dd/MM/yy hh:mm a")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
