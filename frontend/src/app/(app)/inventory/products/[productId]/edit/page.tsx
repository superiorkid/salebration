import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { productKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { detailProduct } from "@/servers/product";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ProductForm from "../../_components/product-form";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const productId = (await params).productId;

  const product = await detailProduct(Number(productId));

  if (!product || "error" in product) {
    return {
      title: `Edit Product`,
      description: `Update product details in your inventory.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Edit ${product.data?.name}`,
    description: `Update details for "${product.data?.name}", including variants, pricing, and inventory.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { productId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productKeys.detail(Number(productId)),
    queryFn: async () => detailProduct(Number(productId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/inventory/products"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Products
        </Link>

        <div className="mt-7 space-y-8 border p-6">
          <PageHeader
            title={`Edit Product #${productId}`}
            description="Update product details, variants, pricing, and inventory information"
          />

          <ProductForm productId={Number(productId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  EditProductPage,
  PermissionsEnum.EDIT_PRODUCTS_PAGE,
);
