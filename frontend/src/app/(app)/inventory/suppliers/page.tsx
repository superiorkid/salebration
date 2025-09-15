import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { supplierKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getSuppliers } from "@/servers/supplier";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import SuppliersTable from "./_components/suppliers-table";

export const metadata: Metadata = {
  title: "Supplier Management",
  description:
    "Manage your vendor relationships and track supplier information in one place.",
  robots: {
    index: false,
    follow: false,
  },
};

const SuppliersPage = async () => {
  const queryCLient = getQueryClient();

  await queryCLient.prefetchQuery({
    queryKey: supplierKeys.all,
    queryFn: async () => getSuppliers(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <div>
        <PageHeader
          title="Supplier Management"
          description="Manage your vendor relationships and track supplier information"
        />

        <div className="mt-7">
          <SuppliersTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  SuppliersPage,
  PermissionsEnum.VIEW_SUPPLIERS_PAGE,
);
