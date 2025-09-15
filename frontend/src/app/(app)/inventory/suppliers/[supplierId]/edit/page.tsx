import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { supplierKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { detailSupplier } from "@/servers/supplier";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import SupplierForm from "../../_components/supplier-form";

interface EditSupplierPageProps {
  params: Promise<{ supplierId: number }>;
}

export async function generateMetadata({
  params,
}: EditSupplierPageProps): Promise<Metadata> {
  const supplierId = (await params).supplierId;

  const supplier = await detailSupplier(Number(supplierId));

  if (!supplier || "error" in supplier) {
    return {
      title: "Supplier Not Found",
      description: "The supplier you're trying to edit could not be found.",
    };
  }

  return {
    title: `Edit Supplier: ${supplier.data?.name}`,
    description: `Update information for supplier ${supplier.data?.name}, including contact and address.`,
  };
}

const EditSupplierPage = async ({ params }: EditSupplierPageProps) => {
  const { supplierId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: supplierKeys.detail(Number(supplierId)),
    queryFn: async () => detailSupplier(supplierId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/inventory/suppliers"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back
        </Link>

        <div className="mt-7 max-w-3xl space-y-8 border p-6">
          <PageHeader
            title="Update Supplier Information"
            description="Edit supplier details including contact information."
          />

          <SupplierForm supplierId={Number(supplierId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  EditSupplierPage,
  PermissionsEnum.EDIT_SUPPLIERS_PAGE,
);
