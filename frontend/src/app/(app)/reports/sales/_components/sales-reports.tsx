"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSalesReport } from "@/hooks/tanstack/reports";
import { TSaleReportSummary } from "@/types/sale-report";
import { AlertCircleIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { Suspense } from "react";
import SalesReportsChart from "./sales-reports-chart";
import SalesReportSummary from "./sales-reports-summary";
import SalesReportsTable from "./sales-reports-table";

const SalesReport = () => {
  const [startDate, _setStartDate] = useQueryState(
    "start_date",
    parseAsIsoDate,
  );
  const [endDate, _setEndDate] = useQueryState("end_date", parseAsIsoDate);
  const [operator, _setOperator] = useQueryState("operator", {
    clearOnDefault: true,
  });
  const [status, _setStatus] = useQueryState("status", {
    clearOnDefault: true,
  });
  const [paymentMethod, _setPaymentMethod] = useQueryState("payment_method", {
    clearOnDefault: true,
  });

  const { error, isError, isPending, salesReport } = useSalesReport({
    status: status as string,
    start_date: startDate as Date,
    end_date: endDate as Date,
    payment_method: paymentMethod as string,
    operator: Number(operator) || undefined,
  });

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch sales report data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-7 space-y-10">
      <Suspense>
        <SalesReportSummary
          summary={salesReport?.data?.summary as TSaleReportSummary}
        />
        <SalesReportsChart
          chartData={
            salesReport?.data?.chart?.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            ) || []
          }
        />
        <SalesReportsTable tableData={salesReport?.data?.table || []} />
      </Suspense>
    </div>
  );
};

export default SalesReport;
