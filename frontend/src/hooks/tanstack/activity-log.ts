import { activityLogKeys } from "@/lib/query-keys";
import { getActivityLogs } from "@/servers/activity-log";
import { useQuery } from "@tanstack/react-query";

export function useActivityLogs() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: activityLogKeys.all,
    queryFn: async () => {
      const activityLogs = await getActivityLogs();
      if ("error" in activityLogs) {
        throw new Error(activityLogs.error);
      }
      return activityLogs;
    },
  });

  return { activityLogs: data, isPending, isError, error };
}
