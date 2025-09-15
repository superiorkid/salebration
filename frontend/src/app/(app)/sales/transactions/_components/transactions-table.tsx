"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTransactions } from "@/hooks/tanstack/sale";
import { AlertCircleIcon } from "lucide-react";
import { transactionColumns } from "./transaction-columns";
import TransactionDataTable from "./transactions-data-table";

const TransationsTable = () => {
  const { error, isError, isPending, transactions } = useTransactions();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch transations data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <TransactionDataTable
      columns={transactionColumns}
      data={transactions?.data || []}
    />
  );
};

export default TransationsTable;
