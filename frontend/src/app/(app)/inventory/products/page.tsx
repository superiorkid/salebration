import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { productKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getProducts } from "@/servers/product";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductTable from "./_components/product-table";
import { Metadata } from "next";
import { env } from "@/env";

export const metadata: Metadata = {
  title: `Product Catalog | ${env.APP_NAME}`,
  description: `Manage your product inventory, variants, and pricing with ${env.APP_NAME}.`,
  robots: {
    index: false,
    follow: false,
  },
};

const ProductsPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productKeys.all,
    queryFn: async () => getProducts(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Product Catalog"
          description="Manage your product inventory, variants, and pricing"
        />

        <div className="mt-7">
          <ProductTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(ProductsPage, PermissionsEnum.VIEW_PRODUCTS_PAGE);
