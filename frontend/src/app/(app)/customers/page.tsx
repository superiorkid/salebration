import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { env } from "@/env";
import { getQueryClient } from "@/lib/query-client";
import { customerKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getCustomers } from "@/servers/customer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import CustomerTable from "./_components/customer-table";

export const metadata: Metadata = {
  title: `Customers | ${env.APP_NAME}`,
  description: `Manage and view detailed customer information in ${env.APP_NAME}.`,
  robots: {
    index: false,
    follow: false,
  },
};

const CustomersPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: customerKeys.all,
    queryFn: async () => getCustomers(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Customers"
          description="Manage and view all customer information."
        />

        <div className="mt-7">
          <CustomerTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  CustomersPage,
  PermissionsEnum.VIEW_CUSTOMERS_PAGE,
);
