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
  addRequestVoucherTaskTaskIdRequestsPost,
  VoucherTaskPublic,
  VoucherTaskRequestCreate,
} from "@/api";
import { VoucherQueryKeys } from "@/features/vouchers/queries";
import ErrorAlert from "@/components/form/fields/error-alert";
import MultiUserField from "@/components/form/fields/multi-user-field";
import SelectField from "@/components/form/fields/select-field";

const issueVoucherTaskFormSchema = z.object({
  user_ids: z.array(z.coerce.number()).nonempty("Users cannot be empty"),
  state: z.enum(["pending", "approved", "rejected"]),
});

type IssueVoucherTaskForm = z.infer<typeof issueVoucherTaskFormSchema>;

interface IssueVoucherTaskFormDialogProps {
  voucherTask: VoucherTaskPublic;
}

const IssueVoucherTaskFormDialog: React.FC<
  PropsWithChildren & IssueVoucherTaskFormDialogProps
> = ({ voucherTask, children }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<IssueVoucherTaskForm>({
    resolver: zodResolver(issueVoucherTaskFormSchema),
    defaultValues: { user_ids: [], state: "approved" },
  });

  const issueVoucherTaskMutation = useMutation({
    mutationFn: (data: VoucherTaskRequestCreate) =>
      addRequestVoucherTaskTaskIdRequestsPost({
        path: { task_id: voucherTask.id },
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VoucherQueryKeys.VoucherTask, voucherTask.id],
      });
      setIsOpen(false);
    },
    onError: (error) => setError(error.message),
  });

  const onSubmit: SubmitHandler<IssueVoucherTaskForm> = async (data) => {
    console.log("data", data);
    await issueVoucherTaskMutation.mutate(data);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
        !open && form.reset();
      }}
      open={isOpen}
    >
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
              <DialogTitle>Issue voucher</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && <ErrorAlert message={error} />}
              <MultiUserField name="user_ids" label="Users" horizontal />
              <SelectField
                horizontal
                name="state"
                label="Request state"
                options={[
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ]}
              />
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

export default IssueVoucherTaskFormDialog;
