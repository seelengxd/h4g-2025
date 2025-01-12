import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/features/orders/queries";
import ProductImage from "@/features/products/product-image";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "../orders/order-card";

const StaffHome = () => {
  const { user } = useCombinedStore((store) => store);
  const { data: orders } = useQuery(getOrders());

  if (!user) {
    return null;
  }

  return (
    <>
      <div>
        <div>
          <h1 className="text-lg font-light">Welcome back,</h1>
          <p className="text-xl uppercase">{user.full_name}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-light">All orders</h2>
          <div className="flex flex-col gap-4">
            {orders &&
              orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffHome;
