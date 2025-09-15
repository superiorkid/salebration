import { stockHistoryKeys } from "@/lib/query-keys";
import { getStockAudits } from "@/servers/stock-audit";
import { useQuery } from "@tanstack/react-query";

export function useStockHistories(productVariantId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: stockHistoryKeys.allByVariantId(productVariantId),
    queryFn: async () => {
      const stockHistories = await getStockAudits(productVariantId);
      if ("error" in stockHistories) {
        throw new Error(stockHistories.error);
      }
      return stockHistories;
    },
  });

  return { stockHistories: data, isPending, isError, error };
}
