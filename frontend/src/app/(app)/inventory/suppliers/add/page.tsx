import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import SupplierForm from "../_components/supplier-form";

export const metadata: Metadata = {
  title: "Add New Supplier",
  description:
    "Enter new supplier details including name, contact info, and address.",
  robots: {
    index: false,
    follow: false,
  },
};

const AddSupplierPage = () => {
  return (
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
          title="Add New Supplier"
          description="Enter supplier details including contact information."
        />

        <SupplierForm />
      </div>
    </div>
  );
};

export default withPermission(
  AddSupplierPage,
  PermissionsEnum.ADD_SUPPLIERS_PAGE,
);
