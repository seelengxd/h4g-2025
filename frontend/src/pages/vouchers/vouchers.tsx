import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import NewVoucherTaskFormDialog from "@/features/vouchers/new-voucher-form";
import { TicketPlus } from "lucide-react";
import { useState } from "react";

const Vouchers = () => {
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="sticky top-0 bg-white">
        <div className="flex justify-between">
          <h1 className="text-2xl font-light">Manage residents</h1>
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
      <div className="flex flex-col gap-6"></div>
    </>
  );
};

export default Vouchers;
