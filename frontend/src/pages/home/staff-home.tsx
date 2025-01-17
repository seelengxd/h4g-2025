import { getOrders } from "@/features/orders/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "../../features/orders/order-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StaffHome = () => {
  const { user } = useCombinedStore((store) => store);
  const { data: orders } = useQuery(getOrders());

  if (!user) {
    return null;
  }

  const pendingOrders = orders?.filter((order) => order.state === "pending");
  const approvedOrders = orders?.filter((order) => order.state === "approved");
  const otherOrders = orders?.filter(
    (order) => order.state !== "pending" && order.state !== "approved"
  );

  return (
    <div className="flex flex-col pb-12">
      <div>
        <h1 className="text-lg">Welcome back,</h1>
        <p className="text-2xl font-medium">{user.full_name}</p>
      </div>
      <Separator className="my-4" />
      <div>
        <Tabs defaultValue="pending">
          <TabsList className="mb-2" variant="outline">
            <TabsTrigger value="pending" variant="outline">
              Pending orders
            </TabsTrigger>
            <TabsTrigger value="approved" variant="outline">
              Approved orders
            </TabsTrigger>
            <TabsTrigger value="others" variant="outline">
              Other orders
            </TabsTrigger>
            <TabsTrigger value="all" variant="outline">
              All orders
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div>
              <h2 className="text-lg font-medium mb-3">
                Pending requests ({pendingOrders?.length})
              </h2>
              <div className="flex flex-col gap-4">
                {pendingOrders &&
                  pendingOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                {!pendingOrders?.length && (
                  <div className="bg-muted text-muted-foreground rounded p-4">
                    No pending requests found
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div>
              <h2 className="text-lg font-medium mb-3">
                Approved requests ({approvedOrders?.length})
              </h2>
              <div className="flex flex-col gap-4">
                {approvedOrders &&
                  approvedOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                {!approvedOrders?.length && (
                  <div className="bg-muted text-muted-foreground rounded p-4">
                    No approved requests found
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="others">
            <div>
              <h2 className="text-lg font-medium mb-3">
                Other requests ({otherOrders?.length})
              </h2>
              <div className="flex flex-col gap-4">
                {otherOrders &&
                  otherOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                {!otherOrders?.length && (
                  <div className="bg-muted text-muted-foreground rounded p-4">
                    No other requests found
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div>
              <h2 className="text-lg font-medium mb-3">
                All requests ({orders?.length})
              </h2>
              <div className="flex flex-col gap-4">
                {orders &&
                  orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                {!orders?.length && (
                  <div className="bg-muted text-muted-foreground rounded p-4">
                    No requests found
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffHome;
