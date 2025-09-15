"use client";

import { TableSkeleton } from "@/components/table-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActivityLogs } from "@/hooks/tanstack/activity-log";
import { AlertCircleIcon } from "lucide-react";
import { activityLogColumns } from "../activity-log-columns";
import ActivityLogDataTable from "./activity-log-data-table";

const ActivityLogTable = () => {
  const { activityLogs, error, isError, isPending } = useActivityLogs();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch activity logs data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ActivityLogDataTable
      columns={activityLogColumns}
      data={activityLogs?.data || []}
    />
  );
};

export default ActivityLogTable;
