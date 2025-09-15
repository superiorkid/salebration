import { FinancialPeriodEnum } from "@/enums/financial-period";

export type TFinancialReportSummary = {
  total_revenue: number;
  total_cogs: number;
  gross_profit: number;
  net_profit: number;
};

export type TFinancialReportChart = {
  month: string;
  revenue: number;
  cogs: number;
  net_profix: number;
};

export type TFinancialReport = {
  summary: TFinancialReportSummary;
  chart: TFinancialReportChart[];
};

export type TFinancialReportParams = {
  period: FinancialPeriodEnum;
  start_date?: string;
  end_date?: string;
};
