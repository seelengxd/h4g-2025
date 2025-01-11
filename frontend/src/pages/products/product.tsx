import { Button } from "@/components/ui/button";
import { getProduct, useUpdateProduct } from "@/features/products/queries";
import UpdateProductFormDialog from "@/features/products/update-product-form";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Luggage, Pencil } from "lucide-react";
import { GoPencil, GoQuestion } from "react-icons/go";
import { Navigate, useParams } from "react-router";

const Product = () => {
  const { id } = useParams<"id">();
  const { data: product, isLoading } = useQuery(getProduct(Number(id)));

  if (isLoading) {
    return null;
  }
  if (!product) {
    return <Navigate to="/products" />;
  }
  return (
    <>
      {/* Display product data */}
      <div className="flex gap-4">
        {product.image ? (
          <img
            src={import.meta.env.VITE_BACKEND_URL + "/uploads/" + product.image}
            alt="user"
            className="w-40 h-40"
          />
        ) : (
          <GoQuestion className="w-20 h-20" />
        )}

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
          <UpdateProductFormDialog product={product}>
            <Button className="mt-4">
              <GoPencil className="w-4 h-4" />
              Edit product
            </Button>
          </UpdateProductFormDialog>
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
        <div>Coming soon...</div>
      </div>
    </>
  );
};

export default Product;
