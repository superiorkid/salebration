import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { reorderKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getReorders } from "@/servers/reorder";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import PurchaseOrdersTable from "./_components/reorders-table";

export const metadata: Metadata = {
  title: "Inventory Replenishment",
  description:
    "Manage low stock items and create purchase orders to restock inventory.",
  robots: {
    index: false,
    follow: false,
  },
};

const ReordersPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reorderKeys.all,
    queryFn: async () => getReorders(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Inventory Replenishment"
          description="Manage low stock items and create purchase orders to restock inventory"
        />

        <div className="mt-7">
          <PurchaseOrdersTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(ReordersPage, PermissionsEnum.VIEW_REORDERS_PAGE);
