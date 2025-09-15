"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FinancialPeriodEnum } from "@/enums/financial-period";
import { useFinancialReport } from "@/hooks/tanstack/reports";
import { TFinancialReportSummary } from "@/types/financial-report";
import { AlertCircleIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { Suspense } from "react";
import FinancialChart from "./financial-chart";
import FinancialSummary from "./financial-summary";

const FinancialReport = () => {
  const [period, _setPeriod] = useQueryState("period", {
    clearOnDefault: true,
  });
  const [startDate, _setStartDate] = useQueryState(
    "start_date",
    parseAsIsoDate,
  );
  const [endDate, _setEndDate] = useQueryState("end_date", parseAsIsoDate);

  const { error, financialReport, isError, isPending } = useFinancialReport({
    period: period as FinancialPeriodEnum,
    end_date: endDate?.toString(),
    start_date: startDate?.toString(),
  });

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch financial report data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Suspense>
      <div className="space-y-10">
        <FinancialSummary
          summaryData={
            financialReport?.data?.summary as TFinancialReportSummary
          }
        />
        <FinancialChart chartData={financialReport?.data?.chart || []} />
      </div>
    </Suspense>
  );
};

export default FinancialReport;
