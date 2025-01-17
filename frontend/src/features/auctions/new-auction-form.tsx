import { PropsWithChildren, useState } from "react";
import AuctionFormDialog, { AuctionForm } from "./auction-form";
import { useCreateAuction } from "./queries";
import { SubmitHandler } from "react-hook-form";

const NewAuctionFormDialog: React.FC<PropsWithChildren> = ({ children }) => {
  const createAuctionMutation = useCreateAuction();

  const onSubmit: SubmitHandler<AuctionForm> = async (data) => {
    await createAuctionMutation.mutate(
      { ...data },
      {
        onSettled: (response) => {
          if (!response || response.error) {
            setError("Something went wrong");
          } else {
            setError("");
          }
        },
      }
    );
  };

  const [error, setError] = useState("");

  return (
    <AuctionFormDialog onSubmit={onSubmit} error={error} setError={setError}>
      {children}
    </AuctionFormDialog>
  );
};

export default NewAuctionFormDialog;
