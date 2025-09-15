import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { permissionKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getPermissions } from "@/servers/permission";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import RoleForm from "../_components/role-form";

export const metadata: Metadata = {
  title: "Create New Role",
  description:
    "Define a new user role and configure its permissions and access levels",
};

const AddRolesPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: permissionKeys.all,
    queryFn: async () => getPermissions(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/settings/roles"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Roles
        </Link>

        <div className="mt-7 max-w-5xl space-y-8 rounded-lg border p-6">
          <PageHeader
            title="Create New Role"
            description="Define a new user role and configure its permissions and access levels"
          />

          <RoleForm />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(AddRolesPage, PermissionsEnum.ADD_ROLES_PAGE);
