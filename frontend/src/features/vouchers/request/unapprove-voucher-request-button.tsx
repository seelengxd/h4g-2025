import {
  TaskUserPublic,
  unapproveRequestsVoucherTaskTaskIdRequestsUnapprovePut,
  VoucherTaskPublic,
} from "@/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketX, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { VoucherQueryKeys } from "../queries";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnapproveVoucherRequestButtonProps {
  request: TaskUserPublic;
  task: VoucherTaskPublic;
}

const UnapproveVoucherRequestButton = ({
  request,
  task,
}: UnapproveVoucherRequestButtonProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const unapproveVoucherMutationRequest = useMutation({
    mutationFn: () =>
      unapproveRequestsVoucherTaskTaskIdRequestsUnapprovePut({
        path: { task_id: request.task_id },
        body: { task_user_ids: [request.id] },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VoucherQueryKeys.VoucherTask, task.id],
      });
      toast({ title: "Voucher request unapproved" });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error unapproving voucher request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <DialogTrigger asChild>
              <Button size="icon-sm" variant="ghost-destructive">
                <TicketX />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Unapprove request</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unapprove voucher request?</DialogTitle>
          <DialogDescription>
            Are you sure you want to unapprove the voucher request from{" "}
            <strong>{request.user.full_name}</strong>?
          </DialogDescription>
        </DialogHeader>
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>
            {task.points} points will be <strong>deducted</strong> from{" "}
            {request.user.full_name} and the request will revert back to{" "}
            <strong>pending</strong> state.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => unapproveVoucherMutationRequest.mutate()}
            >
              Yes, unapprove voucher request
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnapproveVoucherRequestButton;
