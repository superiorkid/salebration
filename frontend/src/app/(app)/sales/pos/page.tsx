import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { withPermission } from "@/lib/with-permission";
import OrderSummary from "./_components/order-summary";
import { Metadata } from "next";
import { env } from "@/env";

export const metadata: Metadata = {
  title: `Point of Sale | ${env.APP_NAME}`,
  description: `Process transactions, manage in-store orders, and accept payments using ${env.APP_NAME}'s POS system.`,
  robots: {
    index: false,
    follow: false,
  },
};

const PosPage = () => {
  return (
    <div>
      <PageHeader
        title="Point of Sale"
        description="Process in-store sales, manage orders, and accept payments"
      />

      <OrderSummary />
    </div>
  );
};

export default withPermission(PosPage, PermissionsEnum.VIEW_SALES_PAGE);
