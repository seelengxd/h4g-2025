import { PropsWithChildren, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useUpdateProduct } from "./queries";

import ProductFormDialog, { ProductForm } from "./product-form";
import { ProductPublic } from "@/api";

type OwnProps = {
  product: ProductPublic;
};

const UpdateProductFormDialog: React.FC<PropsWithChildren & OwnProps> = ({
  children,
  product,
}) => {
  const updateProductMutation = useUpdateProduct(product.id);

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    await updateProductMutation.mutate(
      { ...data },
      {
        onSettled: (response) => {
          if (!response || response.error) {
            setError("Something went wrong");
          } else {
            setError("");
          }
        },
      }
    );
  };

  const [error, setError] = useState("");

  return (
    <ProductFormDialog
      onSubmit={onSubmit}
      error={error}
      setError={setError}
      defaultValues={product}
      title={`Edit product - ${product.name}`}
    >
      {children}
    </ProductFormDialog>
  );
};

export default UpdateProductFormDialog;
