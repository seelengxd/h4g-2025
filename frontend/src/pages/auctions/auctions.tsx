import { useCombinedStore } from "@/store/user/user-store-provider";

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
          {/* {isStaff && (
            <NewProductFormDialog>
              <Button>
                <ListPlus /> Add product
              </Button>
            </NewProductFormDialog>
          )}
          {!isStaff && <CartButton />} */}
        </div>
        <hr className="my-4" />
      </div>
    </>
  );
};

export default Auctions;
