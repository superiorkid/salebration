import PageHeader from "@/components/page-header";
import { env } from "@/env";
import { getQueryClient } from "@/lib/query-client";
import { getDashboardMetrics } from "@/servers/dashboard";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import DashboardContent from "./_components/dashboard/dashboard-content";
import RefreshDashboardButton from "./_components/dashboard/refresh-dashboard-button";

export const metadata: Metadata = {
  title: `Dashboard`,
  description: `View real-time sales performance, inventory status, and key business metrics in ${env.APP_NAME}.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dashboard"],
    queryFn: async () => getDashboardMetrics(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <div className="flex items-center justify-between">
          <PageHeader
            title="Dashboard"
            description="Overview of today's sales performance and business metrics"
          />

          <RefreshDashboardButton />
        </div>

        <DashboardContent />
      </div>
    </HydrationBoundary>
  );
}
