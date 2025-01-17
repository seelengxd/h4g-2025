import {
  OrderTransactionPublic,
  VoucherTaskTransactionPublic,
  BidTransactionPublic,
  BaseTransactionPublic,
} from "@/api";
import TransactionCard from "./transaction-card";

type OwnProps = {
  transactions: (
    | BidTransactionPublic
    | OrderTransactionPublic
    | VoucherTaskTransactionPublic
    | BaseTransactionPublic
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
