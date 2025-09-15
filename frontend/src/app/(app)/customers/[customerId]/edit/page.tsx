import CustomerForm from "@/app/(app)/sales/_components/customer-form";
import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getCustomer } from "@/servers/customer";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface EditCustomerPageProps {
  params: Promise<{ customerId: number }>;
}

export async function generateMetadata({
  params,
}: EditCustomerPageProps): Promise<Metadata> {
  const customerId = (await params).customerId;

  const customer = await getCustomer(customerId);

  if (!customer || "error" in customer) {
    return {
      title: `Edit Customer | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: `Could not load customer details.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Edit ${customer.data?.name}`,
    description: `Update details and preferences for customer ${customer.data?.name}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const EditCustomerPage = async ({ params }: EditCustomerPageProps) => {
  const { customerId } = await params;

  return (
    <div>
      <Link
        href="/customers"
        className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
      >
        <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
        Back to Customers
      </Link>

      <div className="mt-7 max-w-4xl space-y-8 border p-6">
        <PageHeader
          title="Edit Customer"
          description="Update customer details, contact information, and preferences"
        />

        <CustomerForm customerId={customerId} />
      </div>
    </div>
  );
};

export default withPermission(
  EditCustomerPage,
  PermissionsEnum.EDIT_CUSTOMERS_PAGE,
);
