import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/features/orders/queries";
import ProductImage from "@/features/products/product-image";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";

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
              orders.map((order) => (
                <Card>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="flex justify-between">
                      Order #{order.id}
                      <Badge variant={"secondary"}>{order.state}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex p-4 py-2">
                    {order.order_products.map((orderProduct) => (
                      <div className="flex flex-col items-center">
                        <ProductImage
                          product={orderProduct.product}
                          className="w-12 h-12"
                        />
                        <span className="text-sm">x {orderProduct.qty}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffHome;
