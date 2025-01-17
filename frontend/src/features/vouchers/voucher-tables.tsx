import { VoucherTaskPublic } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IssueVoucherTaskFormDialog from "@/features/vouchers/issue-voucher-form";
import RequestStateChip from "@/features/vouchers/request-state-chip";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { format } from "date-fns";
import { UserRoundPlus } from "lucide-react";
import { Link } from "react-router";

interface VoucherTableProps {
  voucher: VoucherTaskPublic;
}

const VoucherTable = ({ voucher }: VoucherTableProps) => {
  const user = useCombinedStore((store) => store.user);
  const userRequests = voucher?.task_users.filter(
    (taskUser) => taskUser.user.id === user?.id
  );

  const pendingRequests = userRequests.filter(
    (taskUser) => taskUser.state === "pending"
  );
  const requestHistory = userRequests
    .filter((taskUser) => taskUser.state !== "pending")
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-xl">
          My Requests ({userRequests?.length})
        </span>
        {voucher && (
          <IssueVoucherTaskFormDialog voucherTask={voucher}>
            <Button variant="outline">
              <UserRoundPlus /> Issue voucher
            </Button>
          </IssueVoucherTaskFormDialog>
        )}
      </div>
      <div className="flex flex-col mb-12">
        <span className="text-lg mb-3">
          Pending requests ({pendingRequests?.length})
        </span>
        {pendingRequests?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request date</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((taskUser) => (
                <TableRow key={taskUser.id}>
                  <TableCell className="w-48 max-w-48 text-nowrap">
                    {format(taskUser.created_at, "dd MMM yyyy hh:mm a")}
                  </TableCell>
                  <TableCell className="text-wrap">
                    <Link
                      to={`/users/${taskUser.user.id}`}
                      className="hover:underline"
                    >
                      {taskUser.user.username}
                    </Link>
                  </TableCell>
                  <TableCell className="text-wrap capitalize w-48 max-w-48">
                    <RequestStateChip state={taskUser.state} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex w-full bg-muted px-4 py-8 rounded justify-center text-muted-foreground">
            No pending requests
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-lg mb-3">
          Past requests ({requestHistory?.length})
        </span>
        {requestHistory?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request date</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Proccessed on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestHistory.map((taskUser) => (
                <TableRow
                  key={taskUser.id}
                  className={
                    taskUser.state === "rejected"
                      ? "bg-zinc-100 opacity-50 hover:opacity-100"
                      : undefined
                  }
                >
                  <TableCell className="w-48 max-w-48 text-nowrap">
                    {format(taskUser.created_at, "dd MMM yyyy hh:mm a")}
                  </TableCell>
                  <TableCell className="text-wrap">
                    <Link
                      to={`/users/${taskUser.user.id}`}
                      className="hover:underline"
                    >
                      {taskUser.user.username}
                    </Link>
                  </TableCell>
                  <TableCell className="text-wrap capitalize w-48 max-w-48">
                    <RequestStateChip state={taskUser.state} />
                  </TableCell>
                  <TableCell className="w-48 max-w-48 text-nowrap">
                    {taskUser.updated_at
                      ? format(taskUser.updated_at, "dd MMM yyyy hh:mm a")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex w-full bg-muted px-4 py-8 rounded justify-center text-muted-foreground">
            No past requests
          </div>
        )}
      </div>
    </>
  );
};

export default VoucherTable;
