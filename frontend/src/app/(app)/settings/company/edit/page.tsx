import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { companyKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getCompany } from "@/servers/company";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import CompanyForm from "./_components/company-form";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();

  if (!company || "error" in company) {
    return {
      title: "Edit Company Profile",
      description: "Update your company's official information and identity.",
    };
  }

  return {
    title: `Edit ${company.data?.name} Profile`,
    description: `Update details for ${company.data?.name}, including contact info and business identity.`,
  };
}

const EditAppPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: companyKeys.all,
    queryFn: async () => getCompany(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/settings/company"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Company Profile
        </Link>

        <div className="mt-7 max-w-5xl space-y-8 rounded-lg border p-6">
          <PageHeader
            title="Edit Company Profile"
            description="Update your company's official information, contact details, and business identity"
          />

          <CompanyForm />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(EditAppPage, PermissionsEnum.EDIT_COMPANY_PAGE);
