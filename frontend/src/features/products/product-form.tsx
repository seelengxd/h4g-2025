import TextField from "@/components/form/fields/text-field";
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
import { PropsWithChildren, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ErrorAlert from "@/components/form/fields/error-alert";
import FileField from "@/components/form/fields/file-field";
import { uploadFile } from "../files/utils";
import NumberField from "@/components/form/fields/number-field";
import SelectField from "@/components/form/fields/select-field";
import { DialogClose } from "@radix-ui/react-dialog";
import { getBarcodeBarcodeBarcodeGet } from "@/api";
import { BarcodeIcon } from "lucide-react";
import "react-barcode-scanner/polyfill";
import BarcodeScanner from "./barcode-scanner";

const productFormSchema = z.object({
  name: z.string(),
  file: z.string().optional(),
  image: z.string().optional().nullable(),
  total_qty: z.coerce.number().min(0),
  points: z.coerce.number().min(0),
  category: z.enum(["food", "nonfood", "special"]),
});

export type ProductForm = z.infer<typeof productFormSchema>;

const newProductFormDefault: ProductForm = {
  name: "",
  total_qty: 0,
  points: 0,
  category: "food",
};

type OwnProps = {
  onSubmit: SubmitHandler<ProductForm>;
  defaultValues?: ProductForm;
  error: string;
  setError: (error: string) => void;
  title?: string;
};

const ProductFormDialog: React.FC<PropsWithChildren & OwnProps> = ({
  children,
  onSubmit,
  defaultValues,
  error,
  setError,
  title = "Add product",
}) => {
  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues ?? newProductFormDefault,
  });

  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
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
              <Button onClick={() => setShowBarcodeScanner(true)} type="button">
                <BarcodeIcon /> Scan Barcode
              </Button>
              {showBarcodeScanner && (
                <BarcodeScanner
                  handleDecodeResult={(result) => {
                    getBarcodeBarcodeBarcodeGet({
                      path: { barcode: result },
                    }).then((response) => {
                      if (!response.data) {
                        return;
                      }
                      const data = response.data;
                      form.setValue("name", data.name);
                      form.setValue("image", data.image);
                      setShowBarcodeScanner(false);
                    });
                  }}
                />
              )}
              <TextField name="name" label="Name" horizontal />
              <NumberField name="total_qty" label="Quantity" horizontal />
              <NumberField name="points" label="Points" horizontal />
              <SelectField
                name="category"
                label="Category"
                options={[
                  {
                    label: "Food",
                    value: "food",
                  },
                  {
                    label: "Non Food",
                    value: "nonfood",
                  },
                  {
                    label: "Special",
                    value: "special",
                  },
                ]}
                horizontal
              />
              <FileField
                name="file"
                label="Product picture"
                horizontal
                onChange={async (e) => {
                  e.persist();
                  if (!e.target.files) {
                    return;
                  }
                  const file = e.target.files[0];
                  // this is stupid but file isnt used anywhere,
                  // i just added another field to not deal with the error
                  const filename = (await uploadFile(file)) as string;

                  form.setValue("image", filename);
                }}
              />
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

export default ProductFormDialog;
