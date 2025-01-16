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
import {
  updateTaskVoucherTaskTaskIdPut,
  VoucherTaskPublic,
  VoucherTaskUpdate,
} from "@/api";
import { VoucherQueryKeys } from "@/features/vouchers/queries";
import NumberField from "@/components/form/fields/number-field";
import ErrorAlert from "@/components/form/fields/error-alert";

const updateVoucherTaskFormSchema = z.object({
  task_name: z.string().nonempty("Task name is required"),
  points: z.coerce
    .number()
    .int("Points must be an integer")
    .min(0, "Points must be greater than 0"),
});

type UpdateVoucherTaskForm = z.infer<typeof updateVoucherTaskFormSchema>;

interface UpdateVoucherTaskFormDialogProps {
  voucherTask: VoucherTaskPublic;
}

const UpdateVoucherTaskFormDialog: React.FC<
  PropsWithChildren & UpdateVoucherTaskFormDialogProps
> = ({ voucherTask, children }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<UpdateVoucherTaskForm>({
    resolver: zodResolver(updateVoucherTaskFormSchema),
    defaultValues: {
      task_name: voucherTask.task_name,
      points: voucherTask.points,
    },
  });

  const updateVoucherTaskMutation = useMutation({
    mutationFn: (data: VoucherTaskUpdate) =>
      updateTaskVoucherTaskTaskIdPut({
        path: { task_id: voucherTask.id },
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VoucherQueryKeys.VoucherTask, voucherTask.id],
      });
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => setError(error.message),
  });

  const onSubmit: SubmitHandler<UpdateVoucherTaskForm> = async (data) => {
    await updateVoucherTaskMutation.mutate(data);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
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
              <DialogTitle>Edit voucher task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && <ErrorAlert message={error} />}
              <TextField name="task_name" label="Task name" horizontal />
              <NumberField name="points" label="Points" horizontal />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateVoucherTaskFormDialog;
