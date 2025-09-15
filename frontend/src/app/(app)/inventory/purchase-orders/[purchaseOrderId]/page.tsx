import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { purchaseOrdersKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { detailPurchaseOrder } from "@/servers/purchase-orders";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import DetailPurchaseOrder from "./_components/detail-purchase-order";

interface DetailPurchaseOrderPageProps {
  params: Promise<{ purchaseOrderId: string }>;
}

export async function generateMetadata({
  params,
}: DetailPurchaseOrderPageProps): Promise<Metadata> {
  const purchaseOrderId = (await params).purchaseOrderId;

  const purchaseOrder = await detailPurchaseOrder(Number(purchaseOrderId));

  if (!purchaseOrder || "error" in purchaseOrder) {
    return {
      title: "Purchase Order Not Found ",
      description: "The purchase order you are looking for does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Purchase Order #${purchaseOrder.data?.purchase_order_number}`,
    description: `Details of purchase order #${purchaseOrder.data?.purchase_order_number}, including items, supplier, and status.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const DetailPurchaseOrderPage = async ({
  params,
}: DetailPurchaseOrderPageProps) => {
  const { purchaseOrderId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: purchaseOrdersKeys.detail(Number(purchaseOrderId)),
    queryFn: async () => detailPurchaseOrder(Number(purchaseOrderId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/inventory/purchase-orders"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Purchase Orders
        </Link>

        <div className="mt-7 space-y-8 border p-6">
          <PageHeader
            title={`Purchase Order #${purchaseOrderId}`}
            description="View all details, items, and status of this purchase order"
          />

          <DetailPurchaseOrder purchaseOrderId={Number(purchaseOrderId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  DetailPurchaseOrderPage,
  PermissionsEnum.DETAIL_PURCHASE_ORDERS_PAGE,
);
