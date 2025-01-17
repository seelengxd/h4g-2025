import {
  MiniTaskUserPublic,
  approveRequestsVoucherTaskTaskIdRequestsApprovePut,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketCheck } from "lucide-react";
import { useState } from "react";
import { VoucherQueryKeys } from "../queries";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApproveVoucherRequestButtonProps {
  request: MiniTaskUserPublic;
  task: VoucherTaskPublic;
}

const ApproveVoucherRequestButton = ({
  request,
  task,
}: ApproveVoucherRequestButtonProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const approveVoucherMutationRequest = useMutation({
    mutationFn: () =>
      approveRequestsVoucherTaskTaskIdRequestsApprovePut({
        path: { task_id: request.task_id },
        body: { task_user_ids: [request.id] },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VoucherQueryKeys.VoucherTask, task.id],
      });
      toast({ title: "Voucher request approved" });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error approving voucher request",
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
              <Button size="icon-sm" variant="ghost-success">
                <TicketCheck />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Approve request</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve voucher request?</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve the voucher request from{" "}
            <strong>{request.user.full_name}</strong>? The user will receive{" "}
            {task.points} points.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => approveVoucherMutationRequest.mutate()}>
              Yes, approve voucher request
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveVoucherRequestButton;
