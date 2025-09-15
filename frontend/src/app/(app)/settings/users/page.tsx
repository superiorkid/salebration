import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getUsers } from "@/servers/users";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import UsersTable from "./_components/users-table";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage system users, their roles, and access permissions",
};

const UsersManagementPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.all,
    queryFn: async () => getUsers(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="User Management"
          description="Manage system users, their roles, and access permissions"
        />

        <div className="mt-7">
          <UsersTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  UsersManagementPage,
  PermissionsEnum.VIEW_USERS_PAGE,
);
