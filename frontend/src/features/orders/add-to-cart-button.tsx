import { Button } from "@/components/ui/button";
import OrderSheet from "./order-sheet";
import { Plus } from "lucide-react";
import { ProductPublic } from "@/api";

type OwnProps = {
  product: ProductPublic;
};
const AddToCartButton: React.FC<OwnProps> = ({ product }) => {
  const isPreorder = product.total_qty === 0;

  return (
    <OrderSheet product={product} isPreorder={isPreorder}>
      <Button className={"mt-4"} variant={isPreorder ? "warning" : "default"}>
        <Plus className="w-4 h-4" />
        {isPreorder ? "Pre-order (Out of stock)" : "Add to cart"}
      </Button>
    </OrderSheet>
  );
};

export default AddToCartButton;
