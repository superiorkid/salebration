import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { stockHistoryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getProductVariantDetail } from "@/servers/product-variant";
import { getStockHistories } from "@/servers/stock-history";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import StockHistoryTable from "./_components/stock-history-table";

interface StockHistoryPageProps {
  params: Promise<{ productVariantId: string }>;
}

export async function generateMetadata({
  params,
}: StockHistoryPageProps): Promise<Metadata> {
  const productVariantId = (await params).productVariantId;

  const productVariant = await getProductVariantDetail(
    Number(productVariantId),
  );

  if (!productVariant || "error" in productVariant) {
    return {
      title: "Stock History",
      description: "View the stock movement history of the selected product.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productName = `${productVariant.data?.product.name} ${productVariant.data?.value}`;
  return {
    title: `Stock History - ${productName}`,
    description: `Tracking all inventory changes for ${productName}.`,
  };
}

const StockHistoryPage = async ({ params }: StockHistoryPageProps) => {
  const { productVariantId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: stockHistoryKeys.allByVariantId(Number(productVariantId)),
    queryFn: async () => getStockHistories(Number(productVariantId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/inventory/stock-managements"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Product
        </Link>

        <div className="mt-7 space-y-8 border p-7">
          <PageHeader
            title={`Stock Movement History`}
            description={`Tracking all inventory changes for variant ${productVariantId}`}
          />

          <StockHistoryTable productVariantId={Number(productVariantId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  StockHistoryPage,
  PermissionsEnum.VIEW_AUDIT_HISTORY_PAGE,
);
