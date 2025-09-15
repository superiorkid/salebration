import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { reportKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getInventoryReport } from "@/servers/reports";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";
import InventoryExport from "./_components/inventory-export";
import InventoryFilter from "./_components/inventory-filter";
import InventoryReport from "./_components/inventory-report";

export const metadata: Metadata = {
  title: "Inventory Analysis",
  description:
    "Comprehensive stock overview including quantities, values, and movement trends",
};

const InventoryReportPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reportKeys.inventoryWithFilters(),
    queryFn: async () => getInventoryReport(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Inventory Analysis"
            description="Comprehensive stock overview including quantities, values, and movement trends"
          />

          <div className="flex flex-wrap gap-2">
            <Suspense
              fallback={
                <Button variant="outline" size="sm" disabled>
                  Loading filters...
                </Button>
              }
            >
              <InventoryFilter />
              <InventoryExport />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<Skeleton className="aspect-video" />}>
          <InventoryReport />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  InventoryReportPage,
  PermissionsEnum.VIEW_REPORTS_INVENTORY_PAGE,
);
