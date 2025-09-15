import { reportKeys } from "@/lib/query-keys";
import {
  getFinancialReport,
  getInventoryReport,
  getSalesReport,
} from "@/servers/reports";
import { TFinancialReportParams } from "@/types/financial-report";
import { TInventoryFilters } from "@/types/inventory-report";
import { TSaleFilters } from "@/types/sale-report";
import { useQuery } from "@tanstack/react-query";

export function useSalesReport(filters: TSaleFilters) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: reportKeys.salesWithFilters(filters),
    queryFn: async () => {
      const salesReport = await getSalesReport(filters);
      if ("error" in salesReport) {
        throw new Error(salesReport.error);
      }
      return salesReport;
    },
    // placeholderData: keepPreviousData,
  });

  return { salesReport: data, isPending, isError, error };
}

export function useInventoryReport(filters: TInventoryFilters) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: reportKeys.inventoryWithFilters(filters),
    queryFn: async () => {
      const inventoryReport = await getInventoryReport(filters);
      if ("error" in inventoryReport) {
        throw new Error(inventoryReport.error);
      }
      return inventoryReport;
    },
    // placeholderData: keepPreviousData,
  });

  return { inventoryReport: data, isPending, isError, error };
}

export function useFinancialReport(filters: TFinancialReportParams) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: reportKeys.financialWithFilters(filters),
    queryFn: async () => {
      const financialReport = await getFinancialReport(filters);
      if ("error" in financialReport) {
        throw new Error(financialReport.error);
      }
      return financialReport;
    },
    // placeholderData: keepPreviousData,
  });

  return { financialReport: data, isPending, isError, error };
}
