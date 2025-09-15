import { getQueryClient } from "@/lib/query-client";
import { productKeys } from "@/lib/query-keys";
import {
  createProduct,
  deleteProduct,
  detailProduct,
  getProducts,
  updateProduct,
} from "@/servers/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useProducts() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: productKeys.all,
    queryFn: async () => {
      const products = await getProducts();
      if ("error" in products) {
        throw new Error(products.error);
      }
      return products;
    },
  });

  return { products: data, isPending, isError, error };
}

export function useCreateProduct() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createProduct(formData);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create product", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create product successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      router.replace("/inventory/products");
    },
  });

  return { createProductMutation: mutate, isPending };
}

export function useProductDetail(productId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: async () => {
      const product = await detailProduct(productId);
      if ("error" in product) {
        throw new Error(product.error);
      }
      return product;
    },
    enabled: !!productId,
  });

  return { product: data, isPending, isError, error };
}

export function useUpdateProduct() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (params: { formData: FormData; productId: number }) => {
      const { formData, productId } = params;
      const result = await updateProduct({ formData, productId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update product", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update product successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      router.replace("/inventory/products");
    },
  });

  return { updateProductMutation: mutate, isPending };
}

export function useDeleteProduct({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (productId: number) => {
      const result = await deleteProduct(productId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete product", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Deleting product successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      onSuccess?.();
    },
  });

  return { deleteProductMutation: mutate, isPending };
}
