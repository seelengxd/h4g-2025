import { ProductPublic } from "@/api";
import { PropsWithChildren, useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, DollarSign, Luggage } from "lucide-react";
import { useCombinedStore } from "@/store/user/user-store-provider";
import ProductImage from "@/features/products/product-image";
import { Alert, AlertDescription } from "@/components/ui/alert";

type OwnProps = {
  product: ProductPublic;
  isPreorder: boolean;
};

const OrderSheet: React.FC<PropsWithChildren & OwnProps> = ({
  product,
  children,
  isPreorder,
}) => {
  const { items, setCart } = useCombinedStore((store) => store);
  const cartItem = items.find((item) => item.product.id === product.id);
  const currentQty = cartItem ? cartItem.qty : 0;
  const [value, setValue] = useState(1);

  const onAdd = () => {
    const filteredOut = items.filter((item) => item.product.id !== product.id);
    setCart([...filteredOut, { product, qty: value + currentQty }]);
  };

  const available = product.total_qty - currentQty;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="hidden">Order Sheet</SheetTitle>
          <SheetDescription>
            <div className="flex gap-4">
              <ProductImage product={product} className="w-40 h-40" />
              <div className="flex flex-col">
                <h1 className="text-2xl font-light text-left">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                  <DollarSign className="w-4 h-4" />
                  {product.points} Pts
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Luggage className="w-4 h-4" />
                  {product.total_qty} left
                </div>
                {isPreorder && (
                  <Alert
                    className="flex items-center gap-2 p-2 px-4 mt-2"
                    variant={"destructive"}
                  >
                    <div>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <AlertDescription>
                      This item is out of stock. Order fulfilment may take
                      longer.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="qty" className="text-right">
              Quantity
            </Label>
            <Input
              id="name"
              type="number"
              defaultValue={1}
              min={1}
              max={available}
              className="col-span-3"
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={onAdd}
              variant={isPreorder ? "warning" : "default"}
            >
              Add to cart {isPreorder && "(Preorder)"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OrderSheet;
