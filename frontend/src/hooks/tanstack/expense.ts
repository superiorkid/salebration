import { getQueryClient } from "@/lib/query-client";
import { expenseKeys } from "@/lib/query-keys";
import {
  createExpense,
  deleteExpense,
  detailExpense,
  getExpenses,
  updateExpense,
} from "@/servers/expense";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useExpenses() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: expenseKeys.all,
    queryFn: async () => {
      const expenses = await getExpenses();
      if ("error" in expenses) {
        throw new Error(expenses.error);
      }
      return expenses;
    },
  });

  return { expenses: data, isPending, isError, error };
}

export function useDetailExpense(expenseId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: expenseKeys.detail(expenseId),
    queryFn: async () => {
      const expense = await detailExpense(expenseId);
      if ("error" in expense) {
        throw new Error(expense.error);
      }
      return expense;
    },
    enabled: !!expenseId,
  });

  return { expense: data, isPending, isError, error };
}

export function useCreateExpense() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createExpense(formData);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create expense", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create expense successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      router.replace("/finance/expenses");
    },
  });

  return { createExpenseMutation: mutate, isPending };
}

export function useUpdateExpense() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: { expenseId: number; formData: FormData }) => {
      const { expenseId, formData } = params;
      const result = await updateExpense({ expenseId, formData });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update expense", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update expense successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });

  return { updateExpenseMutation: mutate, isPending };
}

interface Props {
  onSucces?: () => void;
}

export function useDeleteExpense(props?: Props) {
  const { onSucces } = props || {};

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (expenseId: number) => {
      const result = await deleteExpense(expenseId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete expense", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete expense successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      router.replace("/finance/expenses");
      onSucces?.();
    },
  });

  return { deleteExpenseMutation: mutate, isPending };
}
