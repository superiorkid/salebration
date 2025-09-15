import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { productVariantKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getProductVariants } from "@/servers/product-variant";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import StockManagementTable from "./_components/stock-management-table";

export const metadata: Metadata = {
  title: "Stock Management",
  description:
    "Monitor stock levels, track inventory movements, and manage product availability in your inventory system.",
  robots: {
    index: false,
    follow: false,
  },
};

const StockManagemtnsPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productVariantKeys.all,
    queryFn: async () => getProductVariants(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Inventory Stock Management"
          description="Monitor stock levels, track inventory movements, and manage product availability"
        />

        <StockManagementTable />
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  StockManagemtnsPage,
  PermissionsEnum.VIEW_STOCK_MANAGEMENT_PAGE,
);
