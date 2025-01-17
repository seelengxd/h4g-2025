import { getOrders } from "@/features/orders/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "../../features/orders/order-card";
import { Separator } from "@/components/ui/separator";

const StaffHome = () => {
  const { user } = useCombinedStore((store) => store);
  const { data: orders } = useQuery(getOrders());

  if (!user) {
    return null;
  }

  const pendingOrders = orders?.filter((order) => order.state === "pending");
  const otherOrders = orders?.filter((order) => order.state !== "pending");

  return (
    <>
      <div>
        <div>
          <h1 className="text-lg">Welcome back,</h1>
          <p className="text-2xl font-medium">{user.full_name}</p>
        </div>
        <Separator className="my-4" />
        <div className="my-4">
          <h2 className="text-lg font-medium mb-3">
            Pending requests ({pendingOrders?.length})
          </h2>
          <div className="flex flex-col gap-4">
            {pendingOrders &&
              pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            {!orders && (
              <div className="bg-muted text-muted-foreground rounded p-4">
                No pending requests found
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 pb-12">
          <h2 className="text-lg font-medium mb-3">
            Other requests ({otherOrders?.length})
          </h2>
          <div className="flex flex-col gap-4">
            {otherOrders &&
              otherOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            {!orders && (
              <div className="bg-muted text-muted-foreground rounded p-4">
                No other requests found
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffHome;
