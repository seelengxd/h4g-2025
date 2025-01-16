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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTaskVoucherTaskPost, VoucherTaskCreate } from "@/api";
import { VoucherQueryKeys } from "@/features/vouchers/queries";
import NumberField from "@/components/form/fields/number-field";
import ErrorAlert from "@/components/form/fields/error-alert";

const newVoucherTaskFormSchema = z.object({
  task_name: z.string().nonempty("Task name is required"),
  points: z.coerce
    .number()
    .int("Points must be an integer")
    .min(0, "Points must be greater than 0"),
});

type NewVoucherTaskForm = z.infer<typeof newVoucherTaskFormSchema>;

const NewVoucherTaskFormDialog: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<NewVoucherTaskForm>({
    resolver: zodResolver(newVoucherTaskFormSchema),
    defaultValues: { task_name: "", points: 0 },
  });

  const createVoucherTaskMutation = useMutation({
    mutationFn: (data: VoucherTaskCreate) =>
      addTaskVoucherTaskPost({ body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VoucherQueryKeys.VoucherTask],
      });
      setIsOpen(false);
    },
    onError: (error) => setError(error.message),
  });

  const onSubmit: SubmitHandler<NewVoucherTaskForm> = async (data) => {
    await createVoucherTaskMutation.mutate({ ...data, task_users: [] });
  };

  return (
    <Dialog onOpenChange={(open) => !open && form.reset()} open={isOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-white">
        <Form {...form}>
          <form
            encType="multipart/form-data"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Add voucher task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && <ErrorAlert message={error} />}
              <TextField name="task_name" label="Task name" horizontal />
              <NumberField name="points" label="Points" horizontal />
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

export default NewVoucherTaskFormDialog;
