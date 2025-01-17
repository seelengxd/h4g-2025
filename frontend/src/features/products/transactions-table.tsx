import { ProductTransactionPublic } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns/format";
import { Link } from "react-router";

type OwnProps = {
  transactions: ProductTransactionPublic[];
};

const TransactionTable: React.FC<OwnProps> = ({ transactions }) => {
  return (
    <Table className="border rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Request</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.order_id}>
            <TableCell>
              <Link to={`/orders/${transaction.id}`} className="opacity-80">
                Request #{transaction.id} by {transaction.user.full_name}
              </Link>
            </TableCell>
            <TableCell>{transaction.qty}</TableCell>
            <TableCell>{transaction.order_state}</TableCell>
            <TableCell>
              {format(transaction.created_at, "dd MMM yyyy")}
            </TableCell>
          </TableRow>
        ))}
        {transactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No transactions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
