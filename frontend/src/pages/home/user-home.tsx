import { Card } from "@/components/ui/card";
import { getOrders } from "@/features/orders/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "../../features/orders/order-card";
import TransactionList from "@/features/transactions/transaction-list";

const UserHome = () => {
  const { user } = useCombinedStore((store) => store);
  const { data: orders } = useQuery(getOrders());

  if (!user) {
    return null;
  }

  return (
    <>
      <div>
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
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-3">
            Your requests ({orders?.length})
          </h2>
          <div className="flex flex-col gap-4">
            {orders &&
              orders.map((order) => <OrderCard key={order.id} order={order} />)}
            {!orders && (
              <div className="bg-muted text-muted-foreground rounded p-4">
                No requests found
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-medium">Transaction history</h2>
          <TransactionList transactions={user.transactions} />
        </div>
      </div>
    </>
  );
};

export default UserHome;
