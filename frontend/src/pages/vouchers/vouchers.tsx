import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import NewVoucherTaskFormDialog from "@/features/vouchers/new-voucher-form";
import { getVoucherTasks } from "@/features/vouchers/queries";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, TicketPlus, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const clean = (str: string) => str.toLowerCase().replace(/\s/, "");

const Vouchers = () => {
  const { data: vouchers } = useQuery(getVoucherTasks());
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="sticky top-0 bg-white">
        <div className="flex justify-between">
          <h1 className="text-2xl font-light">Manage vouchers</h1>
          <NewVoucherTaskFormDialog>
            <Button>
              <TicketPlus /> Add voucher task
            </Button>
          </NewVoucherTaskFormDialog>
        </div>

        <Input
          placeholder="Search voucher tasks"
          className="mt-4"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <Separator className="my-4" />
      </div>
      <div className="flex flex-col gap-6">
        {vouchers
          ?.filter((voucher) =>
            clean(voucher.task_name).includes(clean(search))
          )
          .map((voucher) => (
            <Link to={`/vouchers/${voucher.id}`} key={voucher.id}>
              <div className="flex border w-full rounded px-8 py-6 h-32 items-center justify-center cursor-pointer hover:bg-muted/60">
                <div className="flex flex-col items-center justify-center h-full w-16 min-w-16">
                  <span className="text-lg">{voucher.points}</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    points
                  </span>
                </div>

                <Separator orientation="vertical" className="mx-8" />
                <div className="flex flex-col w-full h-full justify-center">
                  <span className="text-xl font-medium">
                    {voucher.task_name}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <UsersRound className="w-4 h-4 mr-1" />
                    {voucher.task_users.length} redemptions / requests
                  </div>
                </div>
                <div className="flex items-center justify-center px-4">
                  <ChevronRight />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default Vouchers;
