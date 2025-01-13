import { OrderState } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AuditLogTable from "@/features/audit-logs/audit-log-table";
import { getOrder, useUpdateOrder } from "@/features/orders/queries";
import ProductImage from "@/features/products/product-image";
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
          Order #{order.id}{" "}
          {isStaff && (
            <span className="font-light">
              from{" "}
              <Link to={`/users/${order.user.id}`} className="hover:opacity-80">
                {order.user.full_name}
              </Link>
            </span>
          )}
        </h1>

        <Badge>{order.state}</Badge>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-light">Order details</h2>
        <div className="flex flex-col gap-4">
          {order &&
            order.order_products.map((orderProduct) => (
              <div className="flex justify-between">
                <ProductImage
                  product={orderProduct.product}
                  className="w-20 h-20"
                />
                <div className="flex flex-col justify-center text-right">
                  <Link
                    to={`/products/${orderProduct.product.id}`}
                    className="hover:opacity-80"
                  >
                    <span>{orderProduct.product.name}</span>
                  </Link>
                  <span className="font-light">x {orderProduct.qty}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-light">Manage order</h2>
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
              <Button onClick={() => updateState("approved")}>Approve</Button>
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
        <h2 className="text-lg font-light">Order history</h2>
        {order.logs && <AuditLogTable logs={order.logs} />}
      </div>
    </div>
  );
};

export default Order;
