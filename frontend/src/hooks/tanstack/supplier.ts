import { getQueryClient } from "@/lib/query-client";
import { supplierKeys } from "@/lib/query-keys";
import {
  createSupplier,
  deleteBulkSupplier,
  deleteSupplier,
  detailSupplier,
  getSuppliers,
  updateSupplier,
} from "@/servers/supplier";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useSuppliers() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: supplierKeys.all,
    queryFn: async () => {
      const suppliers = await getSuppliers();
      if ("error" in suppliers) {
        throw new Error(suppliers.error);
      }
      return suppliers;
    },
  });

  return { suppliers: data, isPending, isError, error };
}

export function useDetailSupplier(supplierId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: supplierKeys.detail(supplierId),
    queryFn: async () => {
      const supplier = await detailSupplier(supplierId);
      if ("error" in supplier) {
        throw new Error(supplier.error);
      }
      return supplier;
    },
    enabled: !!supplierId,
  });

  return { supplier: data, isPending, isError, error };
}

export function useCreateSupplier() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createSupplier(formData);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create supplier", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create supplier successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      router.replace("/inventory/suppliers");
    },
  });

  return { createSupplierMutation: mutate, isPending };
}

export function useUpdateSupplier() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: { supplierId: number; formData: FormData }) => {
      const { supplierId, formData } = params;
      const result = await updateSupplier({ supplierId, formData });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update supplier", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update supplier successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      router.replace("/inventory/suppliers");
    },
  });

  return { updateSupplierMutation: mutate, isPending };
}

interface DeleteSupplierProps {
  onSucces?: () => void;
}

export function useDeleteSupplier(props?: DeleteSupplierProps) {
  const { onSucces } = props || {};

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (supplierId: number) => {
      const result = await deleteSupplier(supplierId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete supplier", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete supplier successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      router.replace("/inventory/suppliers");
      onSucces?.();
    },
  });

  return { deleteSupplierMutation: mutate, isPending };
}

interface DeleteBulkSupplierProps {
  onSuccess?: () => void;
}

export function useDeleteBulkSupplier(props?: DeleteBulkSupplierProps) {
  const { onSuccess } = props || {};

  const { mutate, isPending } = useMutation({
    mutationFn: async (supplierIds: number[]) => {
      const result = await deleteBulkSupplier(supplierIds);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete bulk supplier", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete bulk supplier successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      onSuccess?.();
    },
  });

  return { deleteSupplierMutation: mutate, isPending };
}
