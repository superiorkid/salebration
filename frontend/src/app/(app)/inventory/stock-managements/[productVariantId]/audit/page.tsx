import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { stockAuditKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getProductVariantDetail } from "@/servers/product-variant";
import { getStockAudits } from "@/servers/stock-audit";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ProductVariantInformation from "./_components/product-variant-information";

interface AuditProductPageProps {
  params: Promise<{ productVariantId: string }>;
}

export async function generateMetadata({
  params,
}: AuditProductPageProps): Promise<Metadata> {
  const productVariantId = (await params).productVariantId;

  const productVariant = await getProductVariantDetail(
    Number(productVariantId),
  );

  if (!productVariant || "error" in productVariant) {
    return {
      title: "Audit Product",
      description: "View and verify product stock audit details.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Audit ${productVariant.data?.product.name} ${productVariant.data?.value}`,
    description: `Audit history and stock verification for product: ${productVariant.data?.product.name} ${productVariant.data?.value}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const AuditProductPage = async ({ params }: AuditProductPageProps) => {
  const { productVariantId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: stockAuditKeys.allByVariantId(Number(productVariantId)),
    queryFn: async () => getStockAudits(Number(productVariantId)),
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

        <div className="mt-7 space-y-8 border p-7">
          <PageHeader
            title="Audit Product"
            description="Verify physical stock against system records"
          />

          <ProductVariantInformation />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  AuditProductPage,
  PermissionsEnum.VIEW_STOCK_AUDIT_PAGE,
);
