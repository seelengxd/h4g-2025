import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NewProductFormDialog from "@/features/products/new-product-form";
import { getProducts } from "@/features/products/queries";
import { useQuery } from "@tanstack/react-query";
import { ListPlus } from "lucide-react";
import { useState } from "react";

const Products = () => {
  const [search, setSearch] = useState("");
  const { data: products } = useQuery(getProducts());
  return (
    <>
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-light">Manage inventory</h1>
          <NewProductFormDialog>
            <Button>
              <ListPlus /> Add product
            </Button>
          </NewProductFormDialog>
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
      <div className="grid justify-around gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7">
        {products &&
          products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => (
              <Card className="p-4 w-fit">
                <img
                  src={
                    import.meta.env.VITE_BACKEND_URL +
                    "/uploads/" +
                    product.image
                  }
                  className="object-contain w-40 h-40"
                />
                <div className="mt-2 font-bold">{product.points} Pts </div>
                <div className="font-light">{product.name}</div>
                {/* TODO: account for reserved qty */}
                <div className="text-sm text-slate-500">
                  {product.total_qty} left
                </div>
              </Card>
            ))}
      </div>
    </>
  );
};

export default Products;
