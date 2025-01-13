import { OrderPublic } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ProductImage from "@/features/products/product-image";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { Link } from "react-router";

type OwnProps = {
  order: OrderPublic;
};

const OrderCard: React.FC<OwnProps> = ({ order }) => {
  const user = useCombinedStore((store) => store.user);
  if (!user) {
    return;
  }

  return (
    <Link to={`/orders/${order.id}`}>
      <Card>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="flex justify-between">
            <p>
              Request #{order.id}{" "}
              <span className="font-light">
                {user.role !== "resident" && `by ${order.user.full_name}`}
              </span>
            </p>
            <Badge variant={"secondary"}>{order.state}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex p-4 py-2">
          {order.order_products.map((orderProduct) => (
            <div className="flex flex-col items-center">
              <ProductImage
                product={orderProduct.product}
                className="w-12 h-12"
              />
              <span className="text-sm">x {orderProduct.qty}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </Link>
  );
};

export default OrderCard;
