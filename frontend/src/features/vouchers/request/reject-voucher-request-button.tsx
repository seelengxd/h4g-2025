import {
  rejectRequestsVoucherTaskTaskIdRequestsRejectPut,
  TaskUserPublic,
  VoucherTaskPublic,
} from "@/api";
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
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SquareX } from "lucide-react";
import { useState } from "react";
import { VoucherQueryKeys } from "../queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RejectVoucherRequestButtonProps {
  request: TaskUserPublic;
  task: VoucherTaskPublic;
}

const RejectVoucherRequestButton = ({
  request,
  task,
}: RejectVoucherRequestButtonProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const rejectVoucherMutationRequest = useMutation({
    mutationFn: () =>
      rejectRequestsVoucherTaskTaskIdRequestsRejectPut({
        path: { task_id: request.task_id },
        body: { task_user_ids: [request.id] },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VoucherQueryKeys.VoucherTask, task.id],
      });
      toast({ title: "Voucher request rejected" });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error rejecting voucher request",
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
                <SquareX />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Reject request</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject voucher request?</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject the voucher request from{" "}
            <strong>{request.user.full_name}</strong>? The user will not receive
            the points.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => rejectVoucherMutationRequest.mutate()}
            >
              Yes, reject voucher request
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectVoucherRequestButton;
