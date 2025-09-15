import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { withPermission } from "@/lib/with-permission";
import { Metadata } from "next";
import PurchaseOrdersTable from "./_components/purchase-orders-table";

export const metadata: Metadata = {
  title: "Purchase Order Management",
  description:
    "Create, track, and manage all vendor purchase orders in one place.",
  robots: {
    index: false,
    follow: false,
  },
};

const PurchaseOrderPage = () => {
  return (
    <div>
      <PageHeader
        title="Purchase Order Management"
        description="Create, track, and manage all vendor purchase orders in one place"
      />

      <div className="mt-7">
        <PurchaseOrdersTable />
      </div>
    </div>
  );
};

export default withPermission(
  PurchaseOrderPage,
  PermissionsEnum.VIEW_PURCHASE_ORDERS_PAGE,
);
