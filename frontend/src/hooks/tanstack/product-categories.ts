import { Category } from "@/app/(app)/inventory/categories/category-schema";
import { getQueryClient } from "@/lib/query-client";
import { productCategoriesKeys } from "@/lib/query-keys";
import {
  createCategory,
  deleteBulkCategory,
  deleteCategory,
  detailCategory,
  getProductCategories,
  updateCategory,
} from "@/servers/product-categories";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useCategories(params: { parent_only: boolean }) {
  const { parent_only = false } = params;
  const { data, isPending, error, isError } = useQuery({
    queryKey: productCategoriesKeys.list({ parent_only }),
    queryFn: async () => {
      const categories = await getProductCategories({ parent_only });
      if ("error" in categories) {
        throw new Error(categories.error);
      }
      return categories;
    },
  });

  return { categories: data, isPending, isError, error };
}

interface CreateCategoryMutationProps {
  onSuccess?: () => void;
}

export function useCreateCategory(props?: CreateCategoryMutationProps) {
  const { onSuccess } = props || {};

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: Category) => {
      const result = await createCategory(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create category", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create category successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: productCategoriesKeys.all });
      onSuccess?.();
    },
  });

  return { createCategoryMutation: mutate, isPending };
}

export function useDetailCategory(categoryId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: productCategoriesKeys.detail(categoryId),
    enabled: !!categoryId,
    queryFn: async () => {
      const category = await detailCategory(categoryId);
      if ("error" in category) {
        throw new Error(category.error);
      }
      return category;
    },
  });

  return { category: data, isPending, isError, error };
}

interface UpdateCategoryMutationProps {
  onSuccess?: () => void;
}

export function useUpdateCategory(props?: UpdateCategoryMutationProps) {
  const { onSuccess } = props || {};

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      categoryId,
      values,
    }: {
      categoryId: number;
      values: Category;
    }) => {
      const result = await updateCategory({
        values,
        categoryId: categoryId as number,
      });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update category", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update category successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: productCategoriesKeys.all });
      onSuccess?.();
    },
  });

  return { updateCategoryMutation: mutate, isPending };
}

interface DeleteCategoryMutationProps {
  onSuccess?: () => void;
}

export function useDeleteCategory(props?: DeleteCategoryMutationProps) {
  const { onSuccess } = props || {};
  const { mutate, isPending } = useMutation({
    mutationFn: async (categoryId: number) => {
      const result = await deleteCategory(categoryId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete category", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete category successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: productCategoriesKeys.all });
      onSuccess?.();
    },
  });

  return { deleteCategoryMutation: mutate, isPending };
}

interface DeleteBulkCategoryProps {
  onSuccess?: () => void;
}

export function useBulkDeleteCategory(props?: DeleteBulkCategoryProps) {
  const { onSuccess } = props || {};
  const { mutate, isPending } = useMutation({
    mutationFn: async (categoryIds: number[]) => {
      const result = await deleteBulkCategory(categoryIds);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete bulk category", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete bulk category successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: productCategoriesKeys.all });
      onSuccess?.();
    },
  });

  return { deleteBulkCategoryMutation: mutate, isPending };
}
