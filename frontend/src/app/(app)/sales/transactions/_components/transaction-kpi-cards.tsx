"use client";

import KpiCard from "@/components/kpi-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodayKpis } from "@/hooks/tanstack/sale";
import { formatCurrency } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";

const TransactionKpiCards = () => {
  const { error, isError, isPending, kpis } = useTodayKpis();

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch transactions kpis data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <KpiCard
        title="Total Sales"
        value={kpis?.data?.total_sales.toString() || "0"}
      />
      <KpiCard
        title="Total Revenue"
        value={formatCurrency(kpis?.data?.total_revenue || 0)}
      />
      <KpiCard
        title="Cash Payments"
        value={formatCurrency(kpis?.data?.cash_total || 0)}
      />
      <KpiCard
        title="QRIS/Card"
        value={formatCurrency(
          (kpis?.data?.card_total || 0) + (kpis?.data?.qris_total || 0),
        )}
      />
      <KpiCard
        title="Refund Issued"
        value={`${kpis?.data?.refund_count} refunds`}
      />
      <KpiCard
        title="Items Sold"
        value={`${kpis?.data?.total_sales} Item${(kpis?.data?.total_sales || 0) > 1 ? "s" : ""}`}
      />
    </div>
  );
};

export default TransactionKpiCards;
