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
import { useCreateUser } from "./queries";
import ErrorAlert from "@/components/form/fields/error-alert";

const newUserFormSchema = z.object({
  full_name: z.string(),
  username: z.string(),
});

type NewUserForm = z.infer<typeof newUserFormSchema>;

const newUserFormDefault = {
  full_name: "",
  username: "",
};

const NewUserFormDialog: React.FC<PropsWithChildren> = ({ children }) => {
  const form = useForm<NewUserForm>({
    resolver: zodResolver(newUserFormSchema),
    defaultValues: newUserFormDefault,
  });

  const createUserMutation = useCreateUser();

  const onSubmit: SubmitHandler<NewUserForm> = async (data) => {
    createUserMutation.mutate(
      { ...data, role: "resident" },
      {
        onSettled: (response) => {
          if (!response || response.error) {
            setError("Username is already taken.");
          } else {
            setPassword(response.data);
            setError("");
          }
        },
      }
    );
  };

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setError("");
          setPassword("");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-50">
        {password && (
          <div>
            {form.getValues("full_name")}'s password: {password}. Please note it
            down and let him know, you cannot retrieve it again.
          </div>
        )}
        {error && <ErrorAlert message={error} />}
        {!password && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add resident</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <TextField name="full_name" label="Full name" horizontal />
                <TextField name="username" label="Username" horizontal />
              </div>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewUserFormDialog;
