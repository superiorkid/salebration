import { TReorderCancelled } from "@/app/(app)/inventory/reorders/reorder-cancelled.schema";
import { TReorderWithVariantId } from "@/app/(app)/inventory/stock-managements/reorder/reorder-schema";
import { TOrderAccepted } from "@/app/(supplier)/supplier/confirmation/order-accepted-schema";
import { TOrderRejected } from "@/app/(supplier)/supplier/confirmation/order-rejected-schema";
import { TValidateOrderToken } from "@/app/(supplier)/supplier/confirmation/validate-order-token-schema";
import { getQueryClient } from "@/lib/query-client";
import {
  productVariantKeys,
  reorderKeys,
  stockHistoryKeys,
} from "@/lib/query-keys";
import {
  createReorder,
  deleteReorder,
  detailReorder,
  getReorders,
  markReorderAsAccepted,
  markReorderAsCancelled,
  markReorderAsReceive,
  markReorderAsRejected,
  validateReorderToken,
} from "@/servers/reorder";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useCreateReorder() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TReorderWithVariantId) => {
      const result = await createReorder(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create reorder", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create reorder successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: reorderKeys.all });
      router.push("/inventory/reorders");
    },
  });

  return { createReorderMutation: mutate, isPending };
}

export function useReorders() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: reorderKeys.all,
    queryFn: async () => {
      const reorders = await getReorders();
      if ("error" in reorders) {
        throw new Error(reorders.error);
      }
      return reorders;
    },
  });

  return { reorders: data, isPending, isError, error };
}

export function useMarkReorderAsReceiveMutation({
  reorderId,
  onSuccess,
}: {
  reorderId: number;
  onSuccess?: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await markReorderAsReceive(reorderId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to mark reorder as rereive", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Mark reorder as receive successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: reorderKeys.all });
      queryClient.invalidateQueries({ queryKey: stockHistoryKeys.all });
      onSuccess?.();
    },
  });

  return { markReorderAsReceiveMutation: mutate, isPending };
}

export function useMarkReorderAsCancelMutation({
  reorderId,
  onSuccess,
}: {
  reorderId: number;
  onSuccess?: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TReorderCancelled) => {
      const result = await markReorderAsCancelled({ reorderId, values });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to mark reorder as cancel", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Mark reorder as cancel successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: reorderKeys.all });
      onSuccess?.();
    },
  });

  return { markReorderAsCancelMutation: mutate, isPending };
}

interface DeleteReorderProps {
  onSucces?: () => void;
}

export function useDeleteReorder(props?: DeleteReorderProps) {
  const { onSucces } = props || {};

  const { mutate, isPending } = useMutation({
    mutationFn: async (reorderId: number) => {
      const result = await deleteReorder(reorderId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete reorder", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete reorder successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: reorderKeys.all });
      onSucces?.();
    },
  });

  return { deleteReorderMutation: mutate, isPending };
}

export function useValidateReorderToken() {
  const { mutate, isPending, error, isError, data } = useMutation({
    mutationFn: async (values: TValidateOrderToken) => {
      const result = await validateReorderToken(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
  });

  return {
    validateOrderTokenMutation: mutate,
    isPending,
    error,
    isError,
    data,
  };
}

export function useDetailReorder(reorderId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: reorderKeys.detail(reorderId),
    queryFn: async () => {
      const reorder = await detailReorder(reorderId);
      if ("error" in reorder) {
        throw new Error(reorder.error);
      }
      return reorder;
    },
    enabled: !!reorderId,
  });

  return { reorder: data, isPending, isError, error };
}

export function useMarkReorderAsAccepted({
  reorderId,
  token,
  onSuccess,
}: {
  reorderId: number;
  token: string;
  onSuccess?: () => void;
}) {
  const { mutate, isPending, data } = useMutation({
    mutationFn: async (values: TOrderAccepted) => {
      const result = await markReorderAsAccepted(reorderId, values, token);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to accepted reorder", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Accepted reorder successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: reorderKeys.all });
      queryClient.invalidateQueries({ queryKey: productVariantKeys.all });
      onSuccess?.();
    },
  });

  return { markReorderAsAcceptedMutation: mutate, isPending, data };
}

export function useMarkReorderAsRejected({
  reorderId,
  token,
  onSuccess,
}: {
  reorderId: number;
  token: string;
  onSuccess?: () => void;
}) {
  const { mutate, isPending, data } = useMutation({
    mutationFn: async (values: TOrderRejected) => {
      const result = await markReorderAsRejected(reorderId, values, token);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to rejected reorder", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Rejected reorder successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: reorderKeys.all });
      queryClient.invalidateQueries({ queryKey: productVariantKeys.all });
      onSuccess?.();
    },
  });

  return { markReorderAsRejectedMutation: mutate, isPending, data };
}
