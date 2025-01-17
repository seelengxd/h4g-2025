import { Card } from "@/components/ui/card";
import { getOrders } from "@/features/orders/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "../../features/orders/order-card";
import TransactionList from "@/features/transactions/transaction-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserHome = () => {
  const { user } = useCombinedStore((store) => store);
  const { data: orders } = useQuery(getOrders());

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col pb-12">
      <div>
        <h1 className="text-lg">Welcome back,</h1>
        <p className="text-2xl font-medium">{user.full_name}</p>
      </div>
      <Card className="p-4 mt-4 text-secondary bg-gradient-to-br from-indigo-500 to-cyan-400">
        <div className="text-xs uppercase">Your balance</div>
        <div className="mt-2">
          <span className="font-bold">{user.points}</span> Pts
        </div>
      </Card>
      <div className="mt-6">
        <Tabs defaultValue="requests">
          <TabsList className="mb-2" variant="outline">
            <TabsTrigger value="requests" variant="outline">
              Orders
            </TabsTrigger>
            <TabsTrigger value="transactions" variant="outline">
              Point history
            </TabsTrigger>
          </TabsList>
          <TabsContent value="requests">
            <div>
              <h2 className="text-lg font-medium mb-3">
                My orders ({orders?.length})
              </h2>
              <div className="flex flex-col gap-4">
                {orders &&
                  orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                {!orders?.length && (
                  <div className="bg-muted text-muted-foreground rounded p-4">
                    No orderss found
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="transactions">
            <div className="mt-4">
              <h2 className="text-lg font-medium mb-4">
                My point transaction history
              </h2>
              <TransactionList transactions={user.transactions} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserHome;
