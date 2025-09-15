export type TInventoryReportSummary = {
  total_quantity: number;
  total_value: number;
  sku_count: number;
  low_stock_count: number;
};

export type TInventoryReportTable = {
  id: number;
  product: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
  cost: number;
  value: number;
  updated_at: Date;
};

export type TInventoryReport = {
  summary: TInventoryReportSummary;
  table: TInventoryReportTable[];
};

export type TInventoryFilters = {
  category?: number;
  supplier?: number;
  showLowStock?: boolean;
};
