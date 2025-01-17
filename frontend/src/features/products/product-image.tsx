import { MiniProductPublic } from "@/api";
import { CircleHelp } from "lucide-react";

type OwnProps = {
  product: MiniProductPublic;
  className?: string;
};

const ProductImage: React.FC<OwnProps> = ({ product, className }) => {
  return product.image ? (
    <img
      src={import.meta.env.VITE_BACKEND_URL + "/uploads/" + product.image}
      alt="product"
      className={className ?? "w-20 h-20"}
    />
  ) : (
    <CircleHelp className={className ?? "w-20 h-20"} />
  );
};
export default ProductImage;
