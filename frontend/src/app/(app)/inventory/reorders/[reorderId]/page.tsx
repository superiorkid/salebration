import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { reorderKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { detailReorder } from "@/servers/reorder";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Detailreorder from "./_components/detail-reorder";

interface DetailReorderPageProps {
  params: Promise<{ reorderId: string }>;
}

export async function generateMetadata({
  params,
}: DetailReorderPageProps): Promise<Metadata> {
  const reorderId = (await params).reorderId;
  const reorder = await detailReorder(Number(reorderId));

  if (!reorder || "error" in reorder) {
    return {
      title: `Reorder #${reorderId}`,
      description: "Reorder not found or has been removed.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const supplierName =
    reorder.data?.product_variant.product.supplier?.name ?? "Unknown Supplier";
  return {
    title: `Reorder #${reorderId} - ${supplierName}`,
    description: `View reorder from ${supplierName} including items, notes, and status.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const DetailReorderPage = async ({ params }: DetailReorderPageProps) => {
  const { reorderId } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reorderKeys.detail(Number(reorderId)),
    queryFn: async () => detailReorder(Number(reorderId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/inventory/reorders"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back
        </Link>

        <div className="mt-7 space-y-8 border p-6">
          <PageHeader
            title={`Reorder #${reorderId}`}
            description="View all details, items, and status of this inventory replenishment request"
          />

          <Detailreorder reorderId={Number(reorderId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  DetailReorderPage,
  PermissionsEnum.DETAIL_REORDERS_PAGE,
);
