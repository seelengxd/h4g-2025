import { Button } from "@/components/ui/button";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";

const CartButton = () => {
  const itemsCount = useCombinedStore((store) => store.items.length);
  return (
    <Link to="/cart">
      <Button className="relative rounded-full">
        <ShoppingCart className="w-8 h-8" />
        {itemsCount > 0 && (
          <div className="absolute w-5 h-5 text-sm rounded-full text-slate-700 -right-1 -bottom-2 bg-emerald-200">
            {itemsCount}
          </div>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;
