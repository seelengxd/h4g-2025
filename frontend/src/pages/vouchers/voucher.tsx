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
import { getVoucherTask } from "@/features/vouchers/queries";
import UpdateVoucherTaskFormDialog from "@/features/vouchers/update-voucher-form";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { Coins, Pencil } from "lucide-react";
import { useParams } from "react-router";
import AdminVoucherTable from "@/features/vouchers/voucher-tables";

const Voucher = () => {
  const { id } = useParams<"id">();
  const { data: voucher, isLoading } = useQuery(getVoucherTask(Number(id)));
  const user = useCombinedStore((store) => store.user);

  const isStaff = user?.role !== "resident";
  if (!user || isLoading || !voucher) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="sticky top-0 z-50 w-full max-w-full bg-white flex-0">
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
          <p>{voucher?.description}</p>
        </div>
        <Separator className="my-6" />
      </div>
      <div className="flex flex-col mb-24">
        {isStaff && <AdminVoucherTable voucher={voucher} />}
      </div>
    </div>
  );
};

export default Voucher;
