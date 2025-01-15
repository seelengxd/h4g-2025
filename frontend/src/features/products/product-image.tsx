import { MiniProductPublic } from "@/api";
import { GoQuestion } from "react-icons/go";

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
    <GoQuestion className={className ?? "w-20 h-20"} />
  );
};
export default ProductImage;
