import { PaymentMethodEnum } from "@/enums/payment";
import { TransactionStatusEnum } from "@/enums/transaction-status";

export type TSaleReportSummary = {
  total_revenue: number;
  total_orders: number;
  total_items: number;
  average_order_value: number;
};

export type TSaleReportChart = {
  date: Date;
  total: number;
  average_order_value: number;
  cash_total: number;
  qris_total: number;
};

export type TSaleReportTable = {
  id: number;
  date: Date;
  total_amount: number;
  items_sold: number;
  payment_method: PaymentMethodEnum;
  status: TransactionStatusEnum;
  operator: string;
  customer?: string;
};

export type TSalesReport = {
  summary: TSaleReportSummary;
  chart: TSaleReportChart[];
  table: TSaleReportTable[];
};

export type TSaleFilters = {
  start_date?: Date;
  end_date?: Date;
  operator?: number;
  status?: string;
  payment_method: string;
};
