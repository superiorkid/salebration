export const dynamic = "force-dynamic";

import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { productCategoriesKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getProductCategories } from "@/servers/product-categories";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import CategoryTable from "./_components/category-table";

export const metadata: Metadata = {
  title: "Inventory Categories",
  description:
    "Organize and manage your product hierarchy for better inventory control using categories.",
  robots: {
    index: false,
    follow: false,
  },
};

const InventoryCategoriesPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productCategoriesKeys.list({ parent_only: false }),
    queryFn: async () => getProductCategories({ parent_only: false }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Inventory Categories"
          description="Organize and manage your product hierarchy for better inventory control"
        />

        <div className="mt-7">
          <CategoryTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  InventoryCategoriesPage,
  PermissionsEnum.VIEW_CATEGORIES_PAGE,
);
