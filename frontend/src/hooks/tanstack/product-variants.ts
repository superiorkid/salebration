import { productVariantKeys } from "@/lib/query-keys";
import {
  getProductVariantDetail,
  getProductVariants,
  searchProducts,
} from "@/servers/product-variant";
import { useQuery } from "@tanstack/react-query";

export function useProductVariants() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: productVariantKeys.all,
    queryFn: async () => {
      const variants = await getProductVariants();
      if ("error" in variants) {
        throw new Error(variants.error);
      }
      return variants;
    },
  });

  return { productVariants: data, isPending, isError, error };
}

export function useProductVariantDetail(variantId?: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: productVariantKeys.detail(variantId as number),
    queryFn: async () => {
      const variant = await getProductVariantDetail(variantId as number);
      if ("error" in variant) {
        throw new Error(variant.error);
      }
      return variant;
    },
    enabled: !!variantId,
  });

  return { productVariant: data, isPending, isError, error };
}

export function useSearchProducts(keyword: string, supplierId?: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: productVariantKeys.search(keyword, supplierId as number),
    queryFn: async () => {
      const results = await searchProducts(keyword, supplierId);
      if ("error" in results) {
        throw new Error(results.error);
      }
      return results;
    },
  });

  return { products: data, isPending, error, isError };
}
