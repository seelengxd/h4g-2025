import { RequestState } from "@/api";
import { cva } from "class-variance-authority";

const requestStateChipVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-[450] px-2",
  {
    variants: {
      variant: {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-gray-300 text-gray-800",
        default: "",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface RequestStateChipProps {
  state: RequestState;
}

const RequestStateChip = ({ state }: RequestStateChipProps) => {
  return (
    <div className={requestStateChipVariants({ variant: state })}>{state}</div>
  );
};

export default RequestStateChip;
