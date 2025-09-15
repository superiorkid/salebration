import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import PurchaseOrdersForm from "../_components/purchase-orders-form";

export const metadata: Metadata = {
  title: "Create New Purchase Order",
  description:
    "Fill in supplier details, items, and quantities to create a purchase order.",
  robots: {
    index: false,
    follow: false,
  },
};

const AddPurchaseOrderPage = () => {
  return (
    <div>
      <Link
        href="/inventory/purchase-orders"
        className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
      >
        <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
        Back to Purchase Orders
      </Link>

      <div className="mt-7 space-y-8 border p-6">
        <PageHeader
          title="Create New Purchase Order"
          description="Fill in supplier details, items, and quantities"
        />

        <PurchaseOrdersForm />
      </div>
    </div>
  );
};

export default withPermission(
  AddPurchaseOrderPage,
  PermissionsEnum.ADD_PURCHASE_ORDERS_PAGE,
);
