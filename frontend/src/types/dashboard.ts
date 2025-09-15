export interface TDashboardMetric {
  summary: Summary;
  sales_by_payment_method: SalesByPaymentMethod[];
  top_products: TopProduct[];
  weekly_sales: WeeklySale[];
}

export interface Summary {
  total_revenue: TotalRevenue;
  total_sales: TotalSales;
  refund_count: RefundCount;
  gross_profit: GrossProfit;
}

export interface TotalRevenue {
  value: number;
  comparison: Comparison;
}

export interface Comparison {
  percentage: number;
  trend: "increase" | "decrease" | "neutral";
  value: number;
}

export interface TotalSales {
  value: number;
  comparison: Comparison2;
}

export interface Comparison2 {
  percentage: number;
  trend: string;
  value: number;
}

export interface RefundCount {
  value: number;
  comparison: Comparison3;
}

export interface Comparison3 {
  percentage: number;
  trend: string;
  value: number;
}

export interface GrossProfit {
  value: number;
  comparison: Comparison4;
}

export interface Comparison4 {
  percentage: number;
  trend: string;
  value: number;
}

export interface SalesByPaymentMethod {
  method: string;
  total: number;
}

export interface TopProduct {
  name: string;
  sold: number;
}

export interface WeeklySale {
  date: string;
  total: number;
}
