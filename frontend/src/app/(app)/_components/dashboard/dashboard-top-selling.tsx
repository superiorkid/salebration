"use client";

import { TopProduct } from "@/types/dashboard";

interface DashboardTopSellingProps {
  topProducts: TopProduct[];
}

const DashboardTopSelling = ({ topProducts }: DashboardTopSellingProps) => {
  const isEmpty = !topProducts.length;

  return (
    <div className="flex-1 space-y-8 rounded-lg border p-5 xl:w-3/7">
      <div>
        <h2 className="font-semibold">Top Selling Products</h2>
        <p className="text-muted-foreground text-sm">
          Most purchased items by transaction volume
        </p>
      </div>

      {isEmpty ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-lg font-medium">
            No top selling products yet
          </p>
          <p className="max-w-xs">
            No products have been sold recently. Check back later or add
            products to your catalog.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {topProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:cursor-pointer hover:bg-zinc-200/50"
            >
              <div>
                <h3 className="text-sm font-semibold">{product.name}</h3>
                <p className="text-muted-foreground text-xs">
                  {product.sold} units sold
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">#{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardTopSelling;
