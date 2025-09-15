import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { detailUser } from "@/servers/users";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ActionButtons from "./_components/action-buttons";
import DetailUser from "./_components/detail-user";

interface DetailUserPageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({
  params,
}: DetailUserPageProps): Promise<Metadata> {
  const userId = (await params).userId;

  const user = await detailUser(Number(userId));

  if (!user || "error" in user) {
    return {
      title: "User Not Found",
      description: "The user you are looking for does not exist.",
    };
  }

  const displayName = user.data?.name || user.data?.email;
  return {
    title: `${displayName} | User Details`,
    description: `View and manage profile, roles, and permissions for ${displayName}.`,
  };
}

const DetailUserPage = async ({ params }: DetailUserPageProps) => {
  const { userId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.detail(Number(userId)),
    queryFn: async () => detailUser(Number(userId)),
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

        <div className="mt-7 max-w-5xl space-y-8 rounded-lg border p-6 shadow-sm">
          <PageHeader
            title="User Details"
            description="View complete profile information, activity, and access permissions"
          />

          <div className="flex flex-col gap-6">
            <ActionButtons userId={Number(userId)} />
            <DetailUser userId={Number(userId)} />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  DetailUserPage,
  PermissionsEnum.DETAIL_USERS_PAGE,
);
