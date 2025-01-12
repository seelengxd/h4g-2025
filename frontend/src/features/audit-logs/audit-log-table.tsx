import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { format } from "date-fns";
import { AuditLogPublic } from "@/api";

type OwnProps = {
  logs: AuditLogPublic[];
};

const AuditLogTable: React.FC<OwnProps> = ({ logs }) => {
  if (logs.length === 0) {
    return <p className="text-sm">No logs.</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="w-fit text-nowrap">
              {format(log.created_at, "dd MMM yyyy hh:mm a")}
            </TableCell>
            <TableCell className="text-wrap">{log.action}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuditLogTable;
