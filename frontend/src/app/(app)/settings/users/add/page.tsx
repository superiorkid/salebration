import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { roleKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getRoles } from "@/servers/role";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import CreateUsersForm from "./_components/create-users-form";

export const metadata: Metadata = {
  title: "Create New User",
  description:
    "Add a new user account and configure their roles and permissions",
};

const AddUserPage = async () => {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: roleKeys.all,
    queryFn: async () => getRoles(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/settings/users"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Users
        </Link>

        <div className="mt-7 max-w-5xl space-y-8 rounded-lg border p-6">
          <PageHeader
            title="Create New User"
            description="Add a new user account and configure their roles and permissions"
          />

          <CreateUsersForm />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(AddUserPage, PermissionsEnum.ADD_USERS_PAGE);
