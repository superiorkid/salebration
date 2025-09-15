"use client";

import { FinancialPeriodEnum } from "@/enums/financial-period";
import { formatCurrency } from "@/lib/utils";
import { TFinancialReportChart } from "@/types/financial-report";
import { parseAsIsoDate, useQueryState } from "nuqs";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface FinancialChartProps {
  chartData: TFinancialReportChart[];
}

const FinancialChart = ({ chartData }: FinancialChartProps) => {
  const [period] = useQueryState("period", {
    clearOnDefault: true,
  });
  const [startDate] = useQueryState("start_date", parseAsIsoDate);
  const [endDate] = useQueryState("end_date", parseAsIsoDate);

  const getFilterIndicator = () => {
    switch (period) {
      case FinancialPeriodEnum.MONTHLY:
        return "Monthly";
      case FinancialPeriodEnum.QUARTERLY:
        return "Quarterly";
      case FinancialPeriodEnum.YEARLY:
        return "Yearly";
      case FinancialPeriodEnum.CUSTOM:
        return startDate && endDate
          ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
          : "Custom Range";
      default:
        return "All Time";
    }
  };

  return (
    <section className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Financial Performance
          </h2>
          <div className="mt-1 flex items-center space-x-2">
            <div className="flex items-center rounded-md bg-gray-100 px-3 py-1">
              <span className="text-xs font-medium text-gray-600">
                {getFilterIndicator()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="cogs"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="COGS"
            />
            <Line
              type="monotone"
              dataKey="net_profit"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Net Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-4">
        {[
          { color: "bg-indigo-600", label: "Revenue" },
          { color: "bg-emerald-500", label: "COGS" },
          { color: "bg-amber-500", label: "Net Profit" },
        ].map((item) => (
          <div key={item.label} className="flex items-center">
            <div className={`mr-2 h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FinancialChart;
