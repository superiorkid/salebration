"use client";

import { Button } from "@/components/ui/button";
import { useDownloadInvoicePdf } from "@/hooks/tanstack/invoices";
import { DownloadIcon, EyeIcon, Loader2Icon, PrinterIcon } from "lucide-react";

interface InvoiceActions {
  invoiceId?: number;
}

const InvoiceActions = ({ invoiceId }: InvoiceActions) => {
  const { downloadInvoiceMutation, isPending: isDownloadPending } =
    useDownloadInvoicePdf(invoiceId || 0);

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col space-y-3">
        <Button variant="outline" className="gap-2" disabled>
          <EyeIcon className="h-4 w-4" />
          Preview
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => downloadInvoiceMutation()}
          disabled
        >
          {isDownloadPending ? (
            <>
              <Loader2Icon size={16} strokeWidth={2} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <DownloadIcon size={16} strokeWidth={2} />
              Download PDF
            </>
          )}
        </Button>
        <Button className="bg-primary hover:bg-primary/90 gap-2" disabled>
          <PrinterIcon className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>
    </div>
  );
};

export default InvoiceActions;
