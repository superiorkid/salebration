"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { TInventoryReportTable } from "@/types/inventory-report";
import { format } from "date-fns";

interface InventoryTableProps {
  tableData: TInventoryReportTable[];
}

const InventoryTable = ({ tableData }: InventoryTableProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Inventory Items</h2>
        </div>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden 2xl:block">Supplier</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Last Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.product}</TableCell>
              <TableCell>{data.sku}</TableCell>
              <TableCell>{data.category}</TableCell>
              <TableCell className="hidden 2xl:block">
                {data.supplier}
              </TableCell>
              <TableCell>{data.quantity}</TableCell>
              <TableCell>{formatCurrency(data.cost)}</TableCell>
              <TableCell>{formatCurrency(data.value)}</TableCell>
              <TableCell>
                {format(new Date(data.updated_at), "dd/LL/yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
