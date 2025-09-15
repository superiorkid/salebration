import PageHeader from "@/components/page-header";
import { Suspense } from "react";
import InvoiceDetail from "./_components/invoice-detail";
import InvoiceSearchInput from "./_components/invoice-search-input";
import { withPermission } from "@/lib/with-permission";
import { PermissionsEnum } from "@/enums/permissions";
import { Metadata } from "next";
import { env } from "@/env";

export const metadata: Metadata = {
  title: `Invoice Management | ${env.APP_NAME}`,
  description: `View, create, and manage customer invoices and payments efficiently with ${env.APP_NAME}.`,
  robots: {
    index: false,
    follow: false,
  },
};

const InvoicePage = () => {
  return (
    <div>
      <PageHeader
        title="Invoice Management"
        description="View, create, and manage customer invoices and payments"
      />

      <div className="mt-7 space-y-7 divide-y">
        <Suspense fallback={<div>Loading...</div>}>
          <InvoiceSearchInput />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <InvoiceDetail />
        </Suspense>
      </div>
    </div>
  );
};

export default withPermission(InvoicePage, PermissionsEnum.VIEW_INVOICES_PAGE);
