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
import { useCreateProduct } from "./queries";
import ErrorAlert from "@/components/form/fields/error-alert";
import FileField from "@/components/form/fields/file-field";
import { uploadFile } from "../files/utils";
import NumberField from "@/components/form/fields/number-field";
import SelectField from "@/components/form/fields/select-field";

const newProductFormSchema = z.object({
  name: z.string(),
  file: z.string().optional(),
  image: z.string().optional(),
  total_qty: z.coerce.number().min(0),
  points: z.coerce.number().min(0),
  category: z.enum(["food", "nonfood", "special"]),
});

type NewProductForm = z.infer<typeof newProductFormSchema>;

const newProductFormDefault: NewProductForm = {
  name: "",
  total_qty: 0,
  points: 0,
  category: "food",
};

const NewProductFormDialog: React.FC<PropsWithChildren> = ({ children }) => {
  const form = useForm<NewProductForm>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: newProductFormDefault,
  });

  const createProductMutation = useCreateProduct();

  const onSubmit: SubmitHandler<NewProductForm> = async (data) => {
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
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
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
              <DialogTitle>Add product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProductFormDialog;
