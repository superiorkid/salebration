"use client";

import { formatCurrency } from "@/lib/utils";
import { SalesByPaymentMethod } from "@/types/dashboard";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PaymentMethodsTotalProps {
  paymentMethod: SalesByPaymentMethod[];
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const PaymentMethodsTotal = ({ paymentMethod }: PaymentMethodsTotalProps) => {
  const isEmpty =
    !paymentMethod.length || paymentMethod.every((item) => item.total === 0);

  return (
    <div className="bg-card flex-1 rounded-lg border p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="font-semibold">Payment Method Distribution</h2>
        <p className="text-muted-foreground text-sm">
          Breakdown of transactions by payment type
        </p>
      </div>

      {isEmpty ? (
        <div className="text-muted-foreground flex h-[400px] flex-col items-center justify-center text-center">
          <p className="mb-2 text-lg font-medium">No payment data available</p>
          <p className="max-w-xs">
            There are no recorded transactions for any payment method yet.
          </p>
        </div>
      ) : (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentMethod}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={120}
                paddingAngle={1}
                dataKey="total"
                nameKey="method"
                label={({ name, percent }) =>
                  `${name}\n(${(percent * 100).toFixed(0)}%)`
                }
              >
                {paymentMethod.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Amount"]}
                contentStyle={{
                  background: "white",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsTotal;
