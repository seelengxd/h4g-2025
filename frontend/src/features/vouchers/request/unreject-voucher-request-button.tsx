import {
  unrejectRequestsVoucherTaskTaskIdRequestsUnrejectPut,
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
import { Undo2 } from "lucide-react";
import { useState } from "react";
import { VoucherQueryKeys } from "../queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnrejectVoucherRequestButtonProps {
  request: TaskUserPublic;
  task: VoucherTaskPublic;
}

const UnrejectVoucherRequestButton = ({
  request,
  task,
}: UnrejectVoucherRequestButtonProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const unrejectVoucherMutationRequest = useMutation({
    mutationFn: () =>
      unrejectRequestsVoucherTaskTaskIdRequestsUnrejectPut({
        path: { task_id: request.task_id },
        body: { task_user_ids: [request.id] },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VoucherQueryKeys.VoucherTask, task.id],
      });
      toast({ title: "Voucher request unrejected" });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error unrejecting voucher request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <Undo2 />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Unreject request</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unreject voucher request?</DialogTitle>
          <DialogDescription>
            Are you sure you want to unreject the voucher request from{" "}
            <strong>{request.user.full_name}</strong>? This reverts the request
            state back to <strong>pending</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => unrejectVoucherMutationRequest.mutate()}>
              Yes, unreject voucher request
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnrejectVoucherRequestButton;
