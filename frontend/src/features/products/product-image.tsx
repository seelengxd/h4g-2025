import { MiniProductPublic } from "@/api";
import { CircleHelp } from "lucide-react";

type OwnProps = {
  product: MiniProductPublic;
  className?: string;
};

const ProductImage: React.FC<OwnProps> = ({ product, className }) => {
  if (!product.image) {
    return <CircleHelp className={className ?? "w-20 h-20"} />;
  }
  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : import.meta.env.VITE_BACKEND_URL + "/uploads/" + product.image;
  return (
    <img
      src={imageUrl}
      alt="product"
      className={"object-contain " + (className ?? "w-20 h-20")}
    />
  );
};

export default ProductImage;
