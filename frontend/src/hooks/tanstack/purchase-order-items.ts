import { getQueryClient } from "@/lib/query-client";
import { purchaseOrdersKeys, stockHistoryKeys } from "@/lib/query-keys";
import { updateReceivedQuantity } from "@/servers/purchase-order-items";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useUpdateReceivedQuantity() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: {
      purchaseOrderItemId: number;
      receivedQuantity: number;
    }) => {
      const result = await updateReceivedQuantity(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update received item", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update received item successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: purchaseOrdersKeys.all });
      queryClient.invalidateQueries({ queryKey: stockHistoryKeys.all });
    },
  });

  return { updateReceivedQuantityMutation: mutate, isPending };
}
