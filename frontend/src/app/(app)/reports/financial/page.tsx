import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { reportKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getFinancialReport } from "@/servers/reports";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";
import FinancialExport from "./_components/financial-export";
import FinancialFilter from "./_components/financial-filter";
import FinancialReport from "./_components/financial-report";

export const metadata: Metadata = {
  title: "Financial Reports",
  description: "View and analyze comprehensive financial performance metrics",
};

const FinancialReportPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reportKeys.financialWithFilters(),
    queryFn: async () => getFinancialReport(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Financial Reports"
            description="View and analyze comprehensive financial performance metrics"
          />

          <div className="flex flex-wrap gap-2">
            <Suspense
              fallback={
                <Button variant="outline" disabled>
                  Loading filters...
                </Button>
              }
            >
              <FinancialFilter />
              <FinancialExport />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<Skeleton className="aspect-video" />}>
          <FinancialReport />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  FinancialReportPage,
  PermissionsEnum.VIEW_REPORTS_FINANCIAL_PAGE,
);
