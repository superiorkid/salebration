"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialPeriodEnum } from "@/enums/financial-period";
import { formatCurrency } from "@/lib/utils";
import { TFinancialReportSummary } from "@/types/financial-report";
import {
  DollarSignIcon,
  PackageIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";

interface FinancialSummaryProps {
  summaryData: TFinancialReportSummary;
}

const FinancialSummary = ({ summaryData }: FinancialSummaryProps) => {
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
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {getFilterIndicator()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold tracking-tight 2xl:text-2xl">
            {formatCurrency(summaryData.total_revenue)}
          </div>
          <p className="mt-1 text-xs text-gray-500">All sales income</p>
        </CardContent>
      </Card>

      <Card className="border shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total COGS
            </CardTitle>
            <PackageIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {getFilterIndicator()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold tracking-tight 2xl:text-2xl">
            {formatCurrency(summaryData.total_cogs)}
          </div>
          <p className="mt-1 text-xs text-gray-500">Cost of goods sold</p>
        </CardContent>
      </Card>

      <Card className="border shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gross Profit
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {getFilterIndicator()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold tracking-tight 2xl:text-2xl">
            {formatCurrency(summaryData.gross_profit)}
          </div>
          <p className="mt-1 text-xs text-gray-500">Revenue - COGS</p>
        </CardContent>
      </Card>

      <Card className="border shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Profit
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {getFilterIndicator()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold tracking-tight 2xl:text-2xl">
            {formatCurrency(summaryData.net_profit)}
          </div>
          <p className="mt-1 text-xs text-gray-500">After all expenses</p>
        </CardContent>
      </Card>
    </section>
  );
};

export default FinancialSummary;
