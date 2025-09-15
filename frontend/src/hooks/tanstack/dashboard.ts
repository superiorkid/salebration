import { getDashboardMetrics } from "@/servers/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useDashboardMetrics() {
  const { data, isPending, error, isError, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const metrics = await getDashboardMetrics();
      if ("error" in metrics) {
        throw new Error(metrics.error);
      }
      return metrics;
    },
  });

  return { dashboard: data, isPending, isError, error, refetch, isRefetching };
}
