import { TAuditSchema } from "@/app/(app)/inventory/stock-managements/[productVariantId]/audit/add/audit-schema";
import { getQueryClient } from "@/lib/query-client";
import {
  productVariantKeys,
  stockAuditKeys,
  stockHistoryKeys,
} from "@/lib/query-keys";
import {
  createStockAudit,
  deleteStockAudit,
  getStockAudits,
} from "@/servers/stock-audit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useStockAudits(productVariantId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: stockAuditKeys.allByVariantId(productVariantId),
    queryFn: async () => {
      const stockAudits = await getStockAudits(productVariantId);
      if ("error" in stockAudits) {
        throw new Error(stockAudits.error);
      }
      return stockAudits;
    },
  });

  return { stockAudits: data, isPending, isError, error };
}

export function useCreateStockAudit() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TAuditSchema & { productVariantId: number }) => {
      const result = await createStockAudit(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to audit stock", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data, variables) => {
      toast.success("Audit stock successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: productVariantKeys.all });
      queryClient.invalidateQueries({ queryKey: stockAuditKeys.all });
      queryClient.invalidateQueries({ queryKey: stockHistoryKeys.all });
      router.replace(
        `/inventory/stock-managements/${variables.productVariantId}/audit`,
      );
    },
  });

  return { createStockAuditMutation: mutate, isPending };
}

interface DeleteStockAuditProps {
  onSucces?: () => void;
}

export function useDeleteStockAudit(props?: DeleteStockAuditProps) {
  const { onSucces } = props || {};

  const { mutate, isPending } = useMutation({
    mutationFn: async (stockAuditId: number) => {
      const result = await deleteStockAudit(stockAuditId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete audit", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete audit successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: stockAuditKeys.all });
      queryClient.invalidateQueries({ queryKey: productVariantKeys.all });
      queryClient.invalidateQueries({ queryKey: stockHistoryKeys.all });
      onSucces?.();
    },
  });

  return { deleteStockAuditMutation: mutate, isPending };
}
