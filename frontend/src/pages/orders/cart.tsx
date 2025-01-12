import { Button } from "@/components/ui/button";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router";
import ProductImage from "../../features/products/product-image";
import { useCreateOrder } from "@/features/orders/queries";

const Cart = () => {
  const { items, setCart, user, setUser } = useCombinedStore((store) => store);
  const count = items.length;
  const total = items.reduce(
    (acc, item) => acc + item.product.points * item.qty,
    0
  );
  const navigate = useNavigate();

  const update = (id: number, qty: number) => {
    const copy = [...items];
    const index = copy.findIndex((item) => item.product.id === id);
    if (qty <= copy[index].product.total_qty) {
      copy[index] = { ...copy[index], qty };
    }
    if (qty === 0) {
      copy.splice(index, 1);
    }
    setCart(copy);
  };

  const createOrderMutation = useCreateOrder();
  const submitOrder = () => {
    createOrderMutation.mutate(
      items.map((item) => ({ product_id: item.product.id, qty: item.qty })),
      {
        onSuccess: () => {
          setCart([]);
          navigate("/home");
          setUser({ ...user!, points: user!.points - total });
        },
      }
    );
  };

  if (!user) {
    return;
  }

  return (
    <>
      <div className="flex justify-between">
        <Link to="/products">
          <Button variant={"secondary"}>
            <ChevronLeft /> Back to shop
          </Button>
        </Link>
      </div>
      {count === 0 && (
        <div className="flex flex-col items-center p-8 mt-4 rounded-lg bg-secondary">
          <ShoppingCart className="w-10 h-10" />
          <div className="mt-4 font-semibold">
            Oops, Your Shopping Cart is Empty
          </div>
          <p className="mt-2 text-sm">Browse our minimart now!</p>
          <Link to="/products">
            <Button variant={"outline"} className="mt-4">
              Go shopping now
            </Button>
          </Link>
        </div>
      )}
      {count > 0 && (
        <div>
          <div className="flex justify-between mt-4">
            <div className="text-lg font-semibold">My Cart</div>
            <div className="text-lg font-semibold">{count} Items</div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {items.map((item) => (
              <div className="flex justify-between" key={item.product.id}>
                <div className="flex items-center w-full gap-4">
                  <ProductImage product={item.product} />
                  <div className="flex flex-col gap-2">
                    <div className="text-lg font-semibold">
                      {item.product.name}
                    </div>
                    <div className="text-sm">{item.product.points} Pts/pc</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={"secondary"}
                    className="p-1 rounded-none"
                    onClick={() => update(item.product.id, item.qty - 1)}
                  >
                    <Minus />
                  </Button>
                  {item.qty}
                  <Button
                    variant={"secondary"}
                    className="p-1 rounded-none"
                    onClick={() => update(item.product.id, item.qty + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between mt-4">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-lg font-semibold">{total} Pts</div>
          </div>
          <hr className="my-4" />
          {total <= user.points ? (
            <Button className="mt-8" onClick={submitOrder}>
              Make Request
            </Button>
          ) : (
            <Button disabled>Not enough points to request</Button>
          )}
        </div>
      )}
    </>
  );
};
export default Cart;
