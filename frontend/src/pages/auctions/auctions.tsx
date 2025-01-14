import { Button } from "@/components/ui/button";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { ListPlus } from "lucide-react";

const Auctions = () => {
  const { user } = useCombinedStore((store) => store);

  if (!user) {
    return;
  }
  const isStaff = user.role !== "resident";

  return (
    <>
      <div className="sticky top-0 bg-white">
        <div className="flex justify-between">
          <h1 className="text-2xl font-light">
            {isStaff ? "Manage auctions" : "Auctions"}
          </h1>
          {isStaff && (
            <Button>
              <ListPlus /> Add auction
            </Button>
          )}
        </div>
        <hr className="my-4" />
      </div>
    </>
  );
};

export default Auctions;
