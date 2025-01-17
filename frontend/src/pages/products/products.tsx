import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CartButton from "@/features/orders/cart-button";
import NewProductFormDialog from "@/features/products/new-product-form";
import ProductImage from "@/features/products/product-image";
import { getProducts } from "@/features/products/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { ListPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Products = () => {
  const [search, setSearch] = useState("");
  const { data: products } = useQuery(getProducts());
  const { user } = useCombinedStore((store) => store);

  if (!user) {
    return;
  }
  const isStaff = user.role !== "resident";

  return (
    <>
      <div className="sticky top-0 bg-white">
        <div className="flex justify-between">
          <h1 className="text-2xl font-medium">
            {isStaff ? "Manage inventory" : "Shop"}
          </h1>
          {isStaff && (
            <NewProductFormDialog>
              <Button>
                <ListPlus /> Add product
              </Button>
            </NewProductFormDialog>
          )}
          {!isStaff && <CartButton />}
        </div>
        <Input
          placeholder="Search products"
          className="mt-4"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <hr className="my-4" />
      </div>

      {/* TODO: add filter for product categories */}
      <div className="grid justify-around gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7">
        {products &&
          products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => (
              <Link to={`/products/${product.id}`} key={product.id}>
                <Card className="h-full p-4 w-fit">
                  <ProductImage product={product} className="w-40 h-40" />
                  <div className="mt-2 font-bold">{product.points} Pts </div>
                  <div className="w-40 font-light leading-5">
                    {product.name}
                  </div>
                  {/* TODO: account for reserved qty */}
                  <div className="text-sm text-slate-500">
                    {product.total_qty} left
                  </div>
                </Card>
              </Link>
            ))}
      </div>
    </>
  );
};

export default Products;
