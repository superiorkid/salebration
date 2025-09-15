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
import ProductDetail from "./_components/product-detail";

interface ReorderPageProps {
  searchParams: Promise<{ variantId: string }>;
}

export async function generateMetadata({
  searchParams,
}: ReorderPageProps): Promise<Metadata> {
  const productVariantId = (await searchParams).variantId;

  const productVariant = await getProductVariantDetail(
    Number(productVariantId),
  );

  if (!productVariant || "error" in productVariant) {
    return {
      title: "Reorder Product",
      description: "Manage and reorder inventory for your product.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productName = `${productVariant.data?.product.name} ${productVariant.data?.value}`;
  return {
    title: `Reorder - ${productName}`,
    description: `Reorder inventory for ${productName}${
      productName ? ` (${productName})` : ""
    }. Monitor stock levels and manage restocking.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const ReorderPage = async ({ searchParams }: ReorderPageProps) => {
  const { variantId } = await searchParams;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productVariantKeys.detail(Number(variantId)),
    queryFn: async () => getProductVariantDetail(Number(variantId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/inventory/stock-managements"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back
        </Link>
        <div className="mt-7 max-w-4xl space-y-8 border p-7">
          <PageHeader
            title="Reorder Product"
            description="Lorem ipsum dolor sit amet consectetur adipisicing."
          />

          <ProductDetail variantId={variantId} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(ReorderPage, PermissionsEnum.ADD_REORDERS_PAGE);
