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
import VoucherRequestActions from "@/features/vouchers/request/voucher-request-actions";
import { format } from "date-fns";
import { UserRoundPlus } from "lucide-react";
import { Link } from "react-router";

interface AdminVoucherTableProps {
  voucher: VoucherTaskPublic;
}

const AdminVoucherTable = ({ voucher }: AdminVoucherTableProps) => {
  const pendingRequests = voucher?.task_users.filter(
    (taskUser) => taskUser.state === "pending"
  );
  const requestHistory = voucher?.task_users
    .filter((taskUser) => taskUser.state !== "pending")
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xl font-medium">
          Requests ({voucher?.task_users.length})
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
        <span className="mb-3 text-lg">
          Pending requests ({pendingRequests?.length})
        </span>
        {pendingRequests?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Actions</TableHead>
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
                  <TableCell className="text-wrap">
                    {taskUser.justification || "-"}
                  </TableCell>
                  <TableCell className="w-48 capitalize text-wrap max-w-48">
                    <RequestStateChip state={taskUser.state} />
                  </TableCell>
                  <TableCell>
                    <VoucherRequestActions request={taskUser} task={voucher} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center w-full px-4 py-8 rounded bg-muted text-muted-foreground">
            No pending requests
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="mb-3 text-lg">
          Past requests ({requestHistory?.length})
        </span>
        {requestHistory?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Processed on</TableHead>
                <TableHead>Actions</TableHead>
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
                  <TableCell className="text-wrap">
                    {taskUser.justification || "-"}
                  </TableCell>
                  <TableCell className="w-48 capitalize text-wrap max-w-48">
                    <RequestStateChip state={taskUser.state} />
                  </TableCell>
                  <TableCell className="w-48 max-w-48 text-nowrap">
                    {taskUser.updated_at
                      ? format(taskUser.updated_at, "dd MMM yyyy hh:mm a")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <VoucherRequestActions request={taskUser} task={voucher} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center w-full px-4 py-8 rounded bg-muted text-muted-foreground">
            No past requests
          </div>
        )}
      </div>
    </>
  );
};

export default AdminVoucherTable;
