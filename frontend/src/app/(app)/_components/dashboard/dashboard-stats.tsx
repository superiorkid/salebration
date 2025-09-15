"use client";

import { Summary } from "@/types/dashboard";
import StatsCard from "./stats-card";

interface DashboardStatsProps {
  summary: Summary;
}

const DashboardStats = ({ summary }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={summary.total_revenue.value}
        comparison={summary.total_revenue.comparison}
        description="Includes all sales and refunds"
      />
      <StatsCard
        title="Total Sales"
        value={summary.total_sales.value}
        comparison={summary.total_sales.comparison}
        description="Number of completed transactions"
      />
      <StatsCard
        title="Refunds"
        value={summary.refund_count.value}
        comparison={summary.refund_count.comparison}
        description="Refunded transactions count"
      />
      <StatsCard
        title="Estimated Item Profit"
        value={summary.gross_profit.value}
        comparison={summary.gross_profit.comparison}
        description="Revenue minus cost of goods sold"
      />
    </div>
  );
};

export default DashboardStats;
