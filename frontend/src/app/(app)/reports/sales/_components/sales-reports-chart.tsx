"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { TSaleReportChart } from "@/types/sale-report";
import { format, isSameDay } from "date-fns";
import { EyeIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface SalesReportChartPage {
  chartData: TSaleReportChart[];
}

const SalesReportsChart = ({ chartData }: SalesReportChartPage) => {
  const [startDate, _setStartDate] = useQueryState(
    "start_date",
    parseAsIsoDate,
  );
  const [endDate, _setEndDate] = useQueryState("end_date", parseAsIsoDate);

  const [visibleSeries, setVisibleSeries] = useState({
    total: true,
    average_order_value: true,
    cash_total: true,
    qris_total: true,
  });

  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  const getDateRangeLabel = () => {
    if (!startDate && !endDate) return null;

    if (startDate && endDate) {
      if (isSameDay(startDate, endDate)) {
        return `Showing data for ${format(startDate, "MMM d, yyyy")}`;
      }
      return `Showing data from ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}`;
    }
    return startDate
      ? `Showing data since ${format(startDate, "MMM d, yyyy")}`
      : `Showing data until ${format(endDate as Date, "MMM d, yyyy")}`;
  };

  const dateRangeLabel = getDateRangeLabel();

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">Sales Performance</h3>
          {dateRangeLabel && (
            <p className="text-muted-foreground text-sm">{dateRangeLabel}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span>Visible Data</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Data Series</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleSeries.total}
                onCheckedChange={() => toggleSeries("total")}
              >
                Total Sales
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleSeries.average_order_value}
                onCheckedChange={() => toggleSeries("average_order_value")}
              >
                Average Order
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleSeries.cash_total}
                onCheckedChange={() => toggleSeries("cash_total")}
              >
                Cash Payments
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleSeries.qris_total}
                onCheckedChange={() => toggleSeries("qris_total")}
              >
                QRIS Payments
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              // vertical={false}
              // stroke="#f0f0f0"
            />
            <XAxis
              dataKey="date"
              // tick={{ fill: "#6b7280" }}
              // tickLine={false}
              // axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), ""]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px" }}
            />

            {visibleSeries.total && (
              <Area
                type="monotone"
                dataKey="total"
                name="Total Sales"
                stroke="#8884d8"
                strokeWidth={2}
                fill="#8884d8"
              />
            )}
            {visibleSeries.average_order_value && (
              <Area
                type="monotone"
                dataKey="average_order_value"
                name="Average Order"
                stroke="#82ca9d"
                strokeWidth={2}
                fill="#82ca9d"
              />
            )}
            {visibleSeries.cash_total && (
              <Area
                type="monotone"
                dataKey="cash_total"
                name="Cash Payments"
                stroke="#ffc658"
                strokeWidth={2}
                fill="#ffc658"
              />
            )}
            {visibleSeries.qris_total && (
              <Area
                type="monotone"
                dataKey="qris_total"
                name="QRIS Payments"
                stroke="#ff6b6b"
                strokeWidth={2}
                fill="#ff6b6b"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default SalesReportsChart;
