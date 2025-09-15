import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { roleKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getRoles } from "@/servers/role";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import RolesTable from "./_components/roles-table";

export const metadata: Metadata = {
  title: "Role Management",
  description:
    "Create and manage user roles, permissions, and access levels across the system",
};

const RoleManagementPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: roleKeys.all,
    queryFn: async () => getRoles(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Role Management"
          description="Create and manage user roles, permissions, and access levels across the system"
        />

        <div className="mt-7">
          <RolesTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  RoleManagementPage,
  PermissionsEnum.VIEW_ROLES_PAGE,
);
