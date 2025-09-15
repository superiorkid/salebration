import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { permissionKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getPermissions } from "@/servers/permission";
import { detailRole } from "@/servers/role";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import RoleForm from "../../_components/role-form";

interface EditRolePageProps {
  params: Promise<{ roleId: string }>;
}

export async function generateMetadata({
  params,
}: EditRolePageProps): Promise<Metadata> {
  const roleId = (await params).roleId;

  const role = await detailRole(Number(roleId));

  if (!role || "error" in role) {
    return {
      title: "Role Not Found",
      description: "The role you are trying to edit does not exist.",
    };
  }

  return {
    title: `Edit Role: ${role.data?.name}`,
    description: `Manage permissions and settings for the "${role.data?.name}" role.`,
  };
}

const EditRolePage = async ({ params }: EditRolePageProps) => {
  const { roleId } = await params;
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
          Back
        </Link>

        <div className="mt-7 max-w-5xl space-y-8 border p-6">
          <PageHeader
            title="Edit Role"
            description="Lorem ipsum dolor sit amet consectetur adipisicing."
          />

          <RoleForm roleId={Number(roleId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(EditRolePage, PermissionsEnum.EDIT_ROLES_PAGE);
