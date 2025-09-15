"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TInventoryReportSummary } from "@/types/inventory-report";
import { AlertCircle, Boxes, DollarSign, Package } from "lucide-react";

interface InventorySummaryProps {
  summaryData: TInventoryReportSummary;
}

const InventorySummary = ({ summaryData }: InventorySummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Inventory Overview</h2>
        <span className="text-muted-foreground text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Quantity
            </CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text:xl font-bold 2xl:text-2xl">
              {summaryData.total_quantity.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              All items in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold 2xl:text-2xl">
              {formatCurrency(summaryData.total_value)}
            </div>
            <p className="text-muted-foreground text-xs">
              Current inventory worth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SKU Count</CardTitle>
            <Boxes className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold 2xl:text-2xl">
              {summaryData.sku_count.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Unique products in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold 2xl:text-2xl">
              {summaryData.low_stock_count.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Items needing restock
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventorySummary;
