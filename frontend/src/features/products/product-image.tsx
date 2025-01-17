import { MiniProductPublic } from "@/api";
import { cn } from "@/lib/utils";
import { CircleHelp } from "lucide-react";

type OwnProps = {
  product: MiniProductPublic;
  className?: string;
};

const ProductImage: React.FC<OwnProps> = ({ product, className }) => {
  if (!product.image) {
    return (
      <div
        className={cn(
          "flex w-20 h-20 items-center justify-center bg-zinc-100 rounded text-zinc-700",
          className
        )}
      >
        <CircleHelp />
      </div>
    );
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
