"use client";

import { formatCurrency } from "@/lib/utils";
import { TSaleReportSummary } from "@/types/sale-report";
import { format, isSameDay } from "date-fns";
import {
  BarChart2Icon,
  DollarSignIcon,
  PackageIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";

interface SalesReportSummaryProps {
  summary: TSaleReportSummary;
}

const SalesReportSummary = ({ summary }: SalesReportSummaryProps) => {
  const [startDate, _setStartDate] = useQueryState(
    "start_date",
    parseAsIsoDate,
  );
  const [endDate, _setEndDate] = useQueryState("end_date", parseAsIsoDate);

  const getDateContext = () => {
    if (!startDate && !endDate) return null;

    if (startDate && endDate) {
      return isSameDay(startDate, endDate)
        ? format(startDate, "MMM d, yyyy")
        : `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
    }
    return startDate
      ? `Since ${format(startDate, "MMM d, yyyy")}`
      : `Until ${format(endDate as Date, "MMM d, yyyy")}`;
  };

  const dateContext = getDateContext();
  const timePeriodLabel = dateContext ? dateContext : "All-time";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sales Summary</h2>
        {dateContext && (
          <div className="text-muted-foreground text-sm">{timePeriodLabel}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="bg-card rounded-lg border p-4 shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-muted-foreground text-sm font-medium">
              Total Revenue
            </h3>
            <DollarSignIcon className="text-muted-foreground h-4 w-4" />
          </div>
          <p className="mt-2 text-xl font-bold 2xl:text-2xl">
            {formatCurrency(summary.total_revenue)}
          </p>
          <p className="text-muted-foreground text-xs">
            {dateContext ? "Selected period" : "All-time"}
          </p>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-muted-foreground text-sm font-medium">
              Total Orders
            </h3>
            <ShoppingCartIcon className="text-muted-foreground h-4 w-4" />
          </div>
          <p className="mt-2 text-xl font-bold 2xl:text-2xl">
            {summary.total_orders}
          </p>
          <p className="text-muted-foreground text-xs">
            {dateContext ? "Selected period" : "All-time"}
          </p>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-muted-foreground text-sm font-medium">
              Items Sold
            </h3>
            <PackageIcon className="text-muted-foreground h-4 w-4" />
          </div>
          <p className="mt-2 text-xl font-bold 2xl:text-2xl">
            {summary.total_items}
          </p>
          <p className="text-muted-foreground text-xs">
            {dateContext ? "Selected period" : "All-time"}
          </p>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-muted-foreground text-sm font-medium">
              Avg. Order
            </h3>
            <BarChart2Icon className="text-muted-foreground h-4 w-4" />
          </div>
          <p className="mt-2 text-xl font-bold 2xl:text-2xl">
            {formatCurrency(summary.average_order_value)}
          </p>
          <p className="text-muted-foreground text-xs">
            {dateContext ? "In period" : "All-time"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SalesReportSummary;
