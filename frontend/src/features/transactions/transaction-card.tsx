import {
  BidTransactionPublic,
  OrderTransactionPublic,
  VoucherTaskTransactionPublic,
} from "@/api";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { Link } from "react-router";

type OwnProps = {
  transaction:
    | BidTransactionPublic
    | OrderTransactionPublic
    | VoucherTaskTransactionPublic;
};

const TransactionCard: React.FC<OwnProps> = ({ transaction }) => {
  const link =
    transaction.parent_type === "task_user"
      ? `/vouchers/${
          (transaction as VoucherTaskTransactionPublic).task_user.task_id
        }`
      : transaction.parent_type === "bid"
      ? `/auctions/${(transaction as BidTransactionPublic).bid.auction_id}`
      : transaction.parent_type === "order"
      ? `/orders/${(transaction as OrderTransactionPublic).order.id}`
      : "";

  return (
    <Link to={link}>
      <Card className="p-2 px-4">
        <div className="flex justify-between">
          {transaction.parent_type === "task_user" && (
            <p className="font-semibold">
              Task #
              {(transaction as VoucherTaskTransactionPublic).task_user.task_id}
            </p>
          )}
          {transaction.parent_type === "adhoc" && (
            <p className="font-semibold">Adhoc top-up</p>
          )}
          {transaction.parent_type === "bid" && (
            <p className="font-semibold">
              Auction #{(transaction as BidTransactionPublic).bid.auction_id}
            </p>
          )}
          {transaction.parent_type === "order" && (
            <p className="font-semibold">
              Request #{(transaction as OrderTransactionPublic).order.id}{" "}
              <span className="font-light">
                {transaction.amount > 0 && "(Refunded)"}
              </span>
            </p>
          )}
          <p className="text-sm">
            {format(transaction.created_at, "dd MMM yyyy hh:mm a")}
          </p>
        </div>
        <p
          className={cn("text-right", {
            "text-green-600": transaction.amount > 0,
          })}
        >
          {transaction.amount} pts
        </p>
      </Card>
    </Link>
  );
};

export default TransactionCard;
