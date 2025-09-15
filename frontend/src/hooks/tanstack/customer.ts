import { TCustomer } from "@/app/(app)/sales/customer-schema";
import { getQueryClient } from "@/lib/query-client";
import { customerKeys } from "@/lib/query-keys";
import {
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "@/servers/customer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useCustomers(searchTerm?: string) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: customerKeys.search(searchTerm || ""),
    queryFn: async () => {
      const customers = await getCustomers(searchTerm);
      if ("error" in customers) {
        throw new Error(customers.error);
      }
      return customers;
    },
  });

  return { customers: data, isPending, isError, error };
}

export function useUpdateCustomer({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: { customerId: number; values: TCustomer }) => {
      const { customerId, values } = params;
      const result = await updateCustomer({ customerId, values });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update customer", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update customer successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      onSuccess?.();
    },
  });

  return { updateCustomerMutation: mutate, isPending };
}

export function useDetailCustomer(customerId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: async () => {
      const customer = await getCustomer(customerId);
      if ("error" in customer) {
        throw new Error(customer.error);
      }
      return customer;
    },
    enabled: !!customerId,
  });

  return { customer: data, isPending, isError, error };
}

export function useDeleteCustomer(props?: { onSucces?: () => void }) {
  const { onSucces } = props || {};

  const { mutate, isPending } = useMutation({
    mutationFn: async (customerId: number) => {
      const result = await deleteCustomer(customerId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete customer", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete customer successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      onSucces?.();
    },
  });

  return { deleteCustomerMutation: mutate, isPending };
}
