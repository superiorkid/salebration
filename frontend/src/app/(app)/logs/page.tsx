import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { env } from "@/env";
import { getQueryClient } from "@/lib/query-client";
import { activityLogKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getActivityLogs } from "@/servers/activity-log";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import ActivityLogTable from "./_components/activity-log-table";

export const metadata: Metadata = {
  title: `Activity Logs | ${env.APP_NAME}`,
  description: `Review all system activities and user actions recorded in ${env.APP_NAME}.`,
  robots: {
    index: false,
    follow: false,
  },
};

const ActivityLogsPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: activityLogKeys.all,
    queryFn: async () => getActivityLogs(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Activity Logs"
          description="Track and review all system activities and user actions"
        />

        <div className="mt-7">
          <ActivityLogTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(ActivityLogsPage, PermissionsEnum.VIEW_LOGS_PAGE);
