"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStockHistories } from "@/hooks/tanstack/stock-history";
import { AlertCircleIcon } from "lucide-react";
import { stockHistoryColumns } from "../stock-history-columns";
import StockHistoryDataTable from "./stock-history-data-table";
import { notFound } from "next/navigation";

interface StockHistoryTableProps {
  productVariantId: number;
}

const StockHistoryTable = ({ productVariantId }: StockHistoryTableProps) => {
  const { error, isError, isPending, stockHistories } =
    useStockHistories(productVariantId);

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch stock histories data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!stockHistories?.data) notFound();

  return (
    <StockHistoryDataTable
      columns={stockHistoryColumns}
      data={stockHistories?.data || []}
    />
  );
};

export default StockHistoryTable;
