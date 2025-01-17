import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ErrorAlert from "@/components/form/fields/error-alert";
import NumberField from "@/components/form/fields/number-field";
import SelectField from "@/components/form/fields/select-field";
import { DialogClose } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../products/queries";

const auctionFormSchema = z.object({
  product_id: z.coerce.number(),
  reserve_price: z.coerce.number().min(0),
});

export type AuctionForm = z.infer<typeof auctionFormSchema>;

const actionFormDefault: AuctionForm = {
  product_id: 1,
  reserve_price: 1,
};

type OwnProps = {
  onSubmit: SubmitHandler<AuctionForm>;
  defaultValues?: AuctionForm;
  error: string;
  setError: (error: string) => void;
  title?: string;
};

const AuctionFormDialog: React.FC<PropsWithChildren & OwnProps> = ({
  children,
  onSubmit,
  defaultValues,
  error,
  setError,
  title = "Add auction",
}) => {
  const form = useForm<AuctionForm>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: defaultValues ?? actionFormDefault,
  });

  const { data: products, isLoading } = useQuery(getProducts());
  if (isLoading || !products) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white">
        {error && <ErrorAlert message={error} />}

        <Form {...form}>
          <form
            encType="multipart/form-data"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <SelectField
                name="product_id"
                label="Product"
                options={products.map((product) => ({
                  label: product.name,
                  value: product.id.toString(),
                }))}
                horizontal
              />
              <NumberField name="reserve_price" label="Points" horizontal />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionFormDialog;
