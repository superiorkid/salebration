import { TExpenseCategoriesSchema } from "@/app/(app)/finance/expense-categories/expense-categories-schema";
import { getQueryClient } from "@/lib/query-client";
import { expenseCategoryKeys } from "@/lib/query-keys";
import {
  createExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategoriess,
} from "@/servers/expense-categories";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useExpenseCategories() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: expenseCategoryKeys.all,
    queryFn: async () => {
      const expenseCategories = await getExpenseCategoriess();
      if ("error" in expenseCategories) {
        throw new Error(expenseCategories.error);
      }
      return expenseCategories;
    },
  });

  return { expenseCategories: data, isPending, isError, error };
}

interface Props {
  onSuccess?: () => void;
}

export function useCreateExpenseCategory({ onSuccess }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TExpenseCategoriesSchema) => {
      const result = await createExpenseCategory(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create expense category", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create expense category successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: expenseCategoryKeys.all });
      onSuccess?.();
    },
  });

  return { createExpenseCategoryMutation: mutate, isPending };
}

interface DeleteSupplierProps {
  onSucces?: () => void;
}

export function useDeleteExpenseCategory(props?: DeleteSupplierProps) {
  const { onSucces } = props || {};

  const { mutate, isPending } = useMutation({
    mutationFn: async (categoryId: number) => {
      const result = await deleteExpenseCategory(categoryId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete expense category", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete expense category successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: expenseCategoryKeys.all });
      onSucces?.();
    },
  });

  return { deleteSupplierMutation: mutate, isPending };
}
