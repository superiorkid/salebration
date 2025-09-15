import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { productVariantKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getProductVariantDetail } from "@/servers/product-variant";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ProductVariantInformation from "./_components/product-variant-information";

interface AddStockAuditsPageProps {
  params: Promise<{ productVariantId: string }>;
}

export async function generateMetadata({
  params,
}: AddStockAuditsPageProps): Promise<Metadata> {
  const productVariantId = (await params).productVariantId;

  const productVariant = await getProductVariantDetail(
    Number(productVariantId),
  );

  if (!productVariant || "error" in productVariant) {
    return {
      title: "Record Stock Audit",
      description: `Update and verify physical stock for product variant ID: ${productVariantId}`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Record Audit: ${productVariant.data?.product.name} ${productVariant.data?.value}`,
    description: `Manually record a stock audit for ${productVariant.data?.product.name} ${productVariant.data?.value} to ensure inventory accuracy.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const AddStockAuditsPage = async ({ params }: AddStockAuditsPageProps) => {
  const { productVariantId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productVariantKeys.detail(Number(productVariantId)),
    queryFn: async () => getProductVariantDetail(Number(productVariantId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href={`/inventory/stock-managements/${productVariantId}/audit`}
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Stock Details
        </Link>

        <div className="mt-7 max-w-6xl space-y-8 border p-6">
          <PageHeader
            title="Record Stock Audit"
            description={`Update physical stock count for ${productVariantId}`}
          />

          <ProductVariantInformation />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  AddStockAuditsPage,
  PermissionsEnum.ADD_STOCK_AUDIT_PAGE,
);
