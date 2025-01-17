import { Button } from "@/components/ui/button";
import CartButton from "@/features/orders/cart-button";
import { getProduct } from "@/features/products/queries";
import UpdateProductFormDialog from "@/features/products/update-product-form";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, DollarSign, Luggage, Plus } from "lucide-react";
import { GoPencil } from "react-icons/go";
import { Link, Navigate, useParams } from "react-router";
import ProductImage from "../../features/products/product-image";
import AuditLogTable from "@/features/audit-logs/audit-log-table";
import AddToCartButton from "@/features/orders/add-to-cart-button";

import { format } from "date-fns/format";
import TransactionTable from "@/features/products/transactions-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          {!isStaff && <AddToCartButton product={product} />}
        </div>
      </div>
      {/* Past transactions */}
      <hr className="mt-6" />
      <div className="mt-4">
        <h3 className="mb-2 leading-4 tracking-tight text-slate-600">
          Past transactions
        </h3>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TransactionTable transactions={product.order_products} />
          </TabsContent>
          <TabsContent value="pending">
            <TransactionTable
              transactions={product.order_products.filter(
                (transaction) => transaction.order_state === "pending"
              )}
            />
          </TabsContent>
          <TabsContent value="approved">
            <TransactionTable
              transactions={product.order_products.filter((transaction) =>
                ["approved", "claimed"].includes(transaction.order_state)
              )}
            />
          </TabsContent>
          <TabsContent value="failed">
            <TransactionTable
              transactions={product.order_products.filter((transaction) =>
                ["rejected", "withdrawn"].includes(transaction.order_state)
              )}
            />
          </TabsContent>
        </Tabs>
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
