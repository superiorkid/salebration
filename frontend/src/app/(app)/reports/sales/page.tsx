import PageHeader from "@/components/page-header";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { reportKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getSalesReport } from "@/servers/reports";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import ExportsDropdown from "./_components/export-dropdown";
import SalesReport from "./_components/sales-reports";
import SalesReportFilters from "./_components/sales-reports-filter";

export const metadata: Metadata = {
  title: "Sales Report",
  description:
    "Comprehensive sales performance metrics and transaction trends.",
};

const SalesReportPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reportKeys.salesWithFilters(),
    queryFn: async () => getSalesReport(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Sales Analytics"
            description="Comprehensive sales performance metrics and transaction trends"
          />

          <div className="flex flex-wrap gap-2">
            <Suspense
              fallback={
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Loading filters...
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Export
                  </Button>
                </div>
              }
            >
              <SalesReportFilters />
              <ExportsDropdown />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<Skeleton className="aspect-video" />}>
          <SalesReport />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  SalesReportPage,
  PermissionsEnum.VIEW_REPORTS_SALES_PAGE,
);
