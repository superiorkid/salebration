import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { roleKeys, userKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getRoles } from "@/servers/role";
import { detailUser } from "@/servers/users";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import EditUsersForm from "./_components/edit-users-form";

interface EditUserPageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({
  params,
}: EditUserPageProps): Promise<Metadata> {
  const userId = (await params).userId;

  const user = await detailUser(Number(userId));

  if (!user || "error" in user) {
    return {
      title: "User Not Found",
      description: "The user you are trying to edit does not exist.",
    };
  }

  return {
    title: `Edit ${user.data?.name}'s Profile`,
    description: `Modify details, roles, and permissions for user ${user.data?.name} (${user.data?.email}).`,
  };
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const { userId } = await params;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: roleKeys.all,
      queryFn: async () => getRoles(),
    }),
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(Number(userId)),
      queryFn: async () => detailUser(Number(userId)),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/settings/users"
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            "mb-6",
          )}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Users
        </Link>

        <div className="mt-2 max-w-5xl space-y-8 rounded-lg border p-6 shadow-sm">
          <PageHeader
            title="Edit User Profile"
            description="Update user details, roles, and system access permissions"
          />

          <EditUsersForm userId={Number(userId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(EditUserPage, PermissionsEnum.EDIT_USERS_PAGE);
