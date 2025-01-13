import { OrderProductPublic } from "@/api";
import ProductImage from "../products/product-image";
import { Link } from "react-router";

type OwnProps = {
  orderProduct: OrderProductPublic;
};

const OrderProductItem: React.FC<OwnProps> = ({ orderProduct }) => {
  const hasSufficientStock = orderProduct.product.total_qty >= orderProduct.qty;
  return (
    <div className="flex justify-between">
      <ProductImage product={orderProduct.product} className="w-20 h-20" />
      <div className="flex flex-col justify-center text-right">
        <Link
          to={`/products/${orderProduct.product.id}`}
          className="hover:opacity-80"
        >
          <span>{orderProduct.product.name}</span>
        </Link>
        {hasSufficientStock ? (
          <span className="font-light">x {orderProduct.qty}</span>
        ) : (
          <span className="text-orange-600">
            x {orderProduct.qty} ({orderProduct.product.total_qty} in stock)
          </span>
        )}
      </div>
    </div>
  );
};

export default OrderProductItem;
