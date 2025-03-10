import { PropsWithChildren, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useCreateProduct } from "./queries";

import ProductFormDialog, { ProductForm } from "./product-form";

const NewProductFormDialog: React.FC<PropsWithChildren> = ({ children }) => {
  const createProductMutation = useCreateProduct();

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    await createProductMutation.mutate(
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
    <ProductFormDialog onSubmit={onSubmit} error={error} setError={setError}>
      {children}
    </ProductFormDialog>
  );
};

export default NewProductFormDialog;
