import { OrderState } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AuditLogTable from "@/features/audit-logs/audit-log-table";
import OrderProductItem from "@/features/orders/order-product-item";
import { getOrder, useUpdateOrder } from "@/features/orders/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router";

const Order = () => {
  const { id } = useParams<"id">();
  const { data: order } = useQuery(getOrder(Number(id)));

  const { user } = useCombinedStore((store) => store);

  const updateOrderMutation = useUpdateOrder(Number(id));

  if (!order || !user) {
    return;
  }

  const isStaff = user?.role !== "resident";
  const hasSufficientStock = order.order_products.every(
    (orderProduct) => orderProduct.product.total_qty >= orderProduct.qty
  );

  const updateState = (state: OrderState) => {
    updateOrderMutation.mutate({ state });
  };

  return (
    <div>
      <Link to="/">
        <Button variant={"secondary"}>
          <ChevronLeft /> Back to home
        </Button>
      </Link>
      <div className="flex justify-between mt-4">
        <h1 className="text-lg font-semibold">
          Request #{order.id}{" "}
          {isStaff && (
            <span className="font-light">
              from{" "}
              <Link to={`/users/${order.user.id}`} className="hover:opacity-80">
                {order.user.full_name}
              </Link>
            </span>
          )}
        </h1>

        <Badge variant={"secondary"}>{order.state}</Badge>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-light">Request details</h2>
        <div className="flex flex-col gap-4">
          {order &&
            order.order_products.map((orderProduct) => (
              <OrderProductItem
                orderProduct={orderProduct}
                key={orderProduct.product.id}
              />
            ))}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-light">Manage request</h2>
        {order.state == "pending" &&
          user.role !== "resident" &&
          !hasSufficientStock && (
            <p className="mb-2 text-sm text-orange-600">
              *Some items in the list don't have enough stock. Please replenish
              them before fulfilling the order.
            </p>
          )}
        {/* actions */}
        {["rejected", "withdrawn", "claimed"].includes(order.state) && (
          <p className="font-light">No actions at this time.</p>
        )}
        {order.state === "pending" &&
          (user.role === "resident" ? (
            <Button onClick={() => updateState("withdrawn")}>
              Withdraw order
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={() => updateState("approved")}
                disabled={!hasSufficientStock}
              >
                Approve
              </Button>
              <Button onClick={() => updateState("rejected")}>Reject</Button>
            </div>
          ))}
        {order.state === "approved" && (
          <Button onClick={() => updateState("claimed")}>
            Mark as claimed
          </Button>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-light">Request history</h2>
        {order.logs && <AuditLogTable logs={order.logs} />}
      </div>
    </div>
  );
};

export default Order;
