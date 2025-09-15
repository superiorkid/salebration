"use client";

import { useInvoice } from "@/hooks/tanstack/invoices";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useQueryState } from "nuqs";
import CustomerDetails from "./customer-details";
import InvoiceActions from "./invoice-actions";
import InvoiceHeader from "./invoice-header";
import InvoiceItems from "./invoice-items";
import InvoiceMeta from "./invoice-meta";
import { TCustomer } from "@/types/customer";

const InvoiceDetail = () => {
  const [invoiceNumber] = useQueryState("no", { clearOnDefault: true });
  const { error, invoice, isError, isPending } = useInvoice(
    invoiceNumber || "",
  );

  if (!invoiceNumber) {
    return (
      <div className="p-4 text-center text-gray-500">
        Enter an invoice number to view details
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 p-8">
        <Loader2Icon className="h-6 w-6 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircleIcon className="h-4 w-4" />
          <span className="font-medium">Error</span>
        </div>
        <p className="text-sm text-gray-600">
          {error?.message || "Failed to load invoice"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-6 space-y-4">
      <div className="flex-1 space-y-5">
        <InvoiceHeader />
        <InvoiceMeta invoice={invoice?.data} />
        <InvoiceItems sale={invoice?.data?.sale} />
      </div>
      <div className="w-1/3 space-y-4">
        <CustomerDetails customer={invoice?.data?.sale.customer as TCustomer} />
        <InvoiceActions invoiceId={invoice?.data?.id} />
      </div>
    </div>
  );
};

export default InvoiceDetail;
