import { Button } from "@/components/ui/button";
import CartButton from "@/features/orders/cart-button";
import OrderSheet from "@/features/orders/order-sheet";
import { getProduct } from "@/features/products/queries";
import UpdateProductFormDialog from "@/features/products/update-product-form";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, DollarSign, Luggage, Plus } from "lucide-react";
import { GoPencil } from "react-icons/go";
import { Link, Navigate, useParams } from "react-router";
import ProductImage from "../../features/products/product-image";
import AuditLogTable from "@/features/audit-logs/audit-log-table";

const Product = () => {
  const { id } = useParams<"id">();
  const { data: product, isLoading } = useQuery(getProduct(Number(id)));
  const user = useCombinedStore((store) => store.user);

  if (!user) {
    return;
  }

  if (isLoading) {
    return null;
  }
  if (!product) {
    return <Navigate to="/products" />;
  }

  const isStaff = user.role !== "resident";

  return (
    <>
      {/* Display product data */}
      <div className="flex justify-between">
        <Link to="/products">
          <Button variant={"secondary"}>
            <ChevronLeft /> Back to shop
          </Button>
        </Link>
        {!isStaff && <CartButton />}
      </div>
      <div className="flex gap-4 mt-4">
        <ProductImage product={product} className="w-40 h-40" />

        <div className="pl-4 border-l">
          <div className="flex items-baseline gap-4">
            <h1 className="text-2xl font-light">{product.name}</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
            <DollarSign className="w-4 h-4" />
            {product.points} Pts
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Luggage className="w-4 h-4" />
            {product.total_qty} left
          </div>
          {isStaff && (
            <UpdateProductFormDialog product={product}>
              <Button className="mt-4">
                <GoPencil className="w-4 h-4" />
                Edit product
              </Button>
            </UpdateProductFormDialog>
          )}
          {!isStaff && (
            <OrderSheet product={product}>
              <Button className="mt-4">
                <Plus className="w-4 h-4" />
                Add to cart
              </Button>
            </OrderSheet>
          )}
        </div>
      </div>
      {/* Past transactions */}
      <hr className="mt-6" />
      <div className="mt-4">
        <h3 className="mb-2 leading-4 tracking-tight text-slate-600">
          Past transactions
        </h3>
        <div>Coming soon...</div>
      </div>
      {/* Audit log */}
      <hr className="mt-6" />
      <div className="mt-4">
        <h3 className="mb-2 leading-4 tracking-tight text-slate-600">
          Audit Log
        </h3>

        <AuditLogTable logs={product.logs} />
      </div>
    </>
  );
};

export default Product;
