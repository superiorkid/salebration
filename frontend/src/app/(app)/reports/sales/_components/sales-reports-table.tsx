import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { TSaleReportTable } from "@/types/sale-report";
import { format, isSameDay } from "date-fns";
import { parseAsIsoDate, useQueryState } from "nuqs";

interface SalesReportsTableProps {
  tableData: TSaleReportTable[];
}

const SalesReportsTable = ({ tableData }: SalesReportsTableProps) => {
  const [startDate] = useQueryState("start_date", parseAsIsoDate);
  const [endDate] = useQueryState("end_date", parseAsIsoDate);

  // Format date range label
  const getDateRangeLabel = () => {
    if (!startDate && !endDate) return null;
    if (startDate && endDate) {
      return isSameDay(startDate, endDate)
        ? format(startDate, "MMMM d, yyyy")
        : `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
    }
    return startDate
      ? `From ${format(startDate, "MMM d, yyyy")}`
      : `Until ${format(endDate as Date, "MMM d, yyyy")}`;
  };

  const dateRangeLabel = getDateRangeLabel();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Transaction Details</h2>
          {dateRangeLabel && (
            <p className="text-muted-foreground text-sm">
              Showing transactions: {dateRangeLabel}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Processed By</TableHead>
              <TableHead>Customer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">
                  {format(new Date(data.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{formatCurrency(data.total_amount)}</TableCell>
                <TableCell>{data.items_sold}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {data.payment_method.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>{data.status}</Badge>
                </TableCell>
                <TableCell>{data.operator}</TableCell>
                <TableCell>{data.customer || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default SalesReportsTable;
