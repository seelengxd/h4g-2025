import { TaskUserPublic, VoucherTaskPublic } from "@/api";
import RejectVoucherRequestButton from "./reject-voucher-request-button";
import UnapproveVoucherRequestButton from "./unapprove-voucher-request-button";
import ApproveVoucherRequestButton from "./approve-voucher-request-button";
import UnrejectVoucherRequestButton from "./unreject-voucher-request-button";

interface VoucherRequestActionsProps {
  request: TaskUserPublic;
  task: VoucherTaskPublic;
}

const VoucherRequestActions = ({
  request,
  task,
}: VoucherRequestActionsProps) => {
  if (request.state === "pending") {
    return (
      <div className="flex gap-x-2">
        <RejectVoucherRequestButton request={request} task={task} />
        <ApproveVoucherRequestButton request={request} task={task} />
      </div>
    );
  }

  if (request.state === "approved") {
    return (
      <div>
        <UnapproveVoucherRequestButton request={request} task={task} />
      </div>
    );
  }

  if (request.state === "rejected") {
    return (
      <div>
        <UnrejectVoucherRequestButton request={request} task={task} />
      </div>
    );
  }

  return null;
};

export default VoucherRequestActions;
