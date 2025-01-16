import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IssueVoucherTaskFormDialog from "@/features/vouchers/issue-voucher-form";
import { getVoucherTask } from "@/features/vouchers/queries";
import UpdateVoucherTaskFormDialog from "@/features/vouchers/update-voucher-form";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Coins, Pencil, UserRoundPlus } from "lucide-react";
import { useParams } from "react-router";

const Voucher = () => {
  const { id } = useParams<"id">();
  const { data: voucher, isLoading } = useQuery(getVoucherTask(Number(id)));
  const user = useCombinedStore((store) => store.user);

  const isStaff = user?.role !== "resident";
  if (!user || isLoading) {
    return null;
  }

  const pendingRequests = voucher?.task_users.filter(
    (taskUser) => taskUser.state === "pending"
  );
  const requestHistory = voucher?.task_users.filter(
    (taskUser) => taskUser.state !== "pending"
  );

  return (
    <>
      <div className="flex flex-col sticky top-0 bg-white">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/vouchers">Voucher tasks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{voucher?.task_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-medium">{voucher?.task_name}</h1>
            {isStaff && voucher && (
              <UpdateVoucherTaskFormDialog voucherTask={voucher}>
                <Button>
                  <Pencil /> Edit voucher task
                </Button>
              </UpdateVoucherTaskFormDialog>
            )}
          </div>
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-1" /> {voucher?.points} points
          </div>
        </div>
        <Separator className="my-6" />
      </div>
      <div className="flex flex-col mb-24">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-xl">
            Requests ({voucher?.task_users.length})
          </span>
          {isStaff && voucher && (
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
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
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
                      {taskUser.user.username}
                    </TableCell>
                    <TableCell className="text-wrap capitalize w-48 max-w-48">
                      {taskUser.state}
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
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestHistory.map((taskUser) => (
                  <TableRow key={taskUser.id}>
                    <TableCell className="w-48 max-w-48 text-nowrap">
                      {format(taskUser.created_at, "dd MMM yyyy hh:mm a")}
                    </TableCell>
                    <TableCell className="text-wrap">
                      {taskUser.user.username}
                    </TableCell>
                    <TableCell className="text-wrap capitalize w-48 max-w-48">
                      {taskUser.state}
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
      </div>
    </>
  );
};

export default Voucher;
