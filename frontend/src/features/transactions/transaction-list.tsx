import {
  OrderTransactionPublic,
  VoucherTaskTransactionPublic,
  BidTransactionPublic,
} from "@/api";
import TransactionCard from "./transaction-card";

type OwnProps = {
  transactions: (
    | BidTransactionPublic
    | OrderTransactionPublic
    | VoucherTaskTransactionPublic
  )[];
};

const TransactionList: React.FC<OwnProps> = ({ transactions }) => {
  return (
    <div className="flex flex-col gap-2">
      {transactions.map((transaction) => (
        <TransactionCard transaction={transaction} key={transaction.id} />
      ))}
    </div>
  );
};

export default TransactionList;
