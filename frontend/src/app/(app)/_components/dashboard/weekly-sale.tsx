"use client";

import { formatCurrency } from "@/lib/utils";
import { WeeklySale as TWeeklySale } from "@/types/dashboard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeeklySaleProps {
  data: TWeeklySale[];
}

const WeeklySale = ({ data }: WeeklySaleProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold">Weekly Sales Trend</h2>
        <p className="text-muted-foreground text-sm">
          Daily sales performance over the past week
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400} className="ml-10">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#666" }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis
            dataKey="total"
            tick={{ fill: "#666" }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return `$${value.toLocaleString()}`;
            }}
            domain={[0, "auto"]}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Total"]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            }
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Total Sales"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklySale;
