import { OrderProductPublic } from "@/api";
import ProductImage from "../products/product-image";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";

type OwnProps = {
  orderProduct: OrderProductPublic;
};

const OrderProductItem: React.FC<OwnProps> = ({ orderProduct }) => {
  const hasSufficientStock = orderProduct.product.total_qty >= orderProduct.qty;
  return (
    <div className="flex items-start h-28">
      <ProductImage
        product={orderProduct.product}
        className="h-24 w-24 min-h-24 min-w-24"
      />
      <div className="flex flex-col ml-6 w-full">
        <Link
          to={`/products/${orderProduct.product.id}`}
          className="hover:opacity-80"
        >
          <p className="mb-1 line-clamp-1 overflow-ellipsis">
            {orderProduct.product.name}
          </p>
        </Link>
        <div className="text-sm flex items-center gap-2">
          <span className="text-muted-foreground line-clamp-1">
            {orderProduct.product.points} points
          </span>
          <span>
            x {orderProduct.qty}{" "}
            {!hasSufficientStock && (
              <span className="text-orange-600">
                ({orderProduct.product.total_qty} in stock)
              </span>
            )}
          </span>
        </div>
        <Separator className="my-2" />
        <span className="text-sm text-muted-foreground">
          Total: {orderProduct.product.points * orderProduct.qty} points
        </span>
      </div>
    </div>
  );
};

export default OrderProductItem;
