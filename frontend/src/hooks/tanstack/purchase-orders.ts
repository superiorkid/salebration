import { TPurchaseOrderSchema } from "@/app/(app)/inventory/purchase-orders/add/purchase-orders-schema";

import { TPurchaseOrderCancelled } from "@/app/(app)/inventory/purchase-orders/[purchaseOrderId]/purchase-order-cancelled-schema";

import { TOrderAccepted } from "@/app/(supplier)/supplier/confirmation/order-accepted-schema";
import { TOrderRejected } from "@/app/(supplier)/supplier/confirmation/order-rejected-schema";
import { getQueryClient } from "@/lib/query-client";
import { purchaseOrdersKeys } from "@/lib/query-keys";
import {
  createPurchasOrders,
  detailPurchaseOrder,
  getPurcaseOrders,
  markPurchaseOrderAsAccepted,
  markPurchaseOrderAsCancelled,
  markPurchaseOrderAsRejected,
} from "@/servers/purchase-orders";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function usePurchaseOrders() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: purchaseOrdersKeys.all,
    queryFn: async () => {
      const purchaseOrders = await getPurcaseOrders();
      if ("error" in purchaseOrders) {
        throw new Error(purchaseOrders.error);
      }
      return purchaseOrders;
    },
  });

  return { purchaseOrders: data, isPending, isError, error };
}

export function useCreatePurchaseOrders() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TPurchaseOrderSchema) => {
      const result = await createPurchasOrders(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create purchase orders", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create purchase orders successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: purchaseOrdersKeys.all });
      router.replace("/inventory/purchase-orders");
    },
  });

  return { createPurchaseOrderMutation: mutate, isPending };
}

export function useDetailPurchaseOrder(purchaseOrderId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: purchaseOrdersKeys.detail(purchaseOrderId),
    queryFn: async () => {
      const purchaseOrder = await detailPurchaseOrder(purchaseOrderId);
      if ("error" in purchaseOrder) {
        throw new Error(purchaseOrder.error);
      }
      return purchaseOrder;
    },
    enabled: !!purchaseOrderId,
  });

  return { purchaseOrder: data, isPending, isError, error };
}

export function useMarkPurchaseOrderAsAccepted({
  purchaseOrderId,
  token,
  onSuccess,
}: {
  purchaseOrderId: number;
  token: string;
  onSuccess?: () => void;
}) {
  const { mutate, isPending, data } = useMutation({
    mutationFn: async (values: TOrderAccepted) => {
      const result = await markPurchaseOrderAsAccepted(
        purchaseOrderId,
        values,
        token,
      );
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to accepted purchase order", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Accepted purchase order successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: purchaseOrdersKeys.all });
      onSuccess?.();
    },
  });

  return { markPurchaseOrderAsAcceptedMutation: mutate, isPending, data };
}

export function useMarkPurchaseOrderAsRejected({
  purchaseOrderId,
  token,
  onSuccess,
}: {
  purchaseOrderId: number;
  token: string;
  onSuccess?: () => void;
}) {
  const { mutate, isPending, data } = useMutation({
    mutationFn: async (values: TOrderRejected) => {
      const result = await markPurchaseOrderAsRejected(
        purchaseOrderId,
        values,
        token,
      );
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to rejecte purchase order", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Rejected purchase order successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: purchaseOrdersKeys.all });
      onSuccess?.();
    },
  });

  return { markPurchaseOrderAsRejectedMutation: mutate, isPending, data };
}

export function useMarkPurchaseOrderAsCancelled({
  purchaseOrderId,
  onSuccess,
}: {
  purchaseOrderId: number;
  onSuccess?: () => void;
}) {
  const { mutate, isPending, data } = useMutation({
    mutationFn: async (values: TPurchaseOrderCancelled) => {
      const result = await markPurchaseOrderAsCancelled(
        purchaseOrderId,
        values,
      );
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to cancelled purchase order", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Cancelled purchase order successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: purchaseOrdersKeys.all });
      onSuccess?.();
    },
  });

  return { markPurchaseOrderAsCancelledMutation: mutate, isPending, data };
}
