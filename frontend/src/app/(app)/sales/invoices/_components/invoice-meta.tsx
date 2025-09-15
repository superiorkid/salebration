"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TInvoice } from "@/types/invoice";
import { format } from "date-fns";
import AddCustomerDialog from "../../_components/add-customer-dialog";

interface InvoiceMetaProps {
  invoice?: TInvoice;
}

const InvoiceMeta = ({ invoice }: InvoiceMetaProps) => {
  return (
    <div className="flex justify-between bg-zinc-100 p-5">
      <div className="space-y-2.5">
        <h3 className="font-semibold 2xl:text-lg">Invoice Number</h3>
        <div className="text-muted-foreground space-y-0.5 text-sm">
          <p>
            {invoice?.number}{" "}
            <Badge className="h-5 uppercase">{invoice?.sale.status}</Badge>
          </p>
          <p>
            Issued Date:{" "}
            {format(new Date(invoice?.issued_at as Date), "dd/LL/yyyy")}
          </p>
          <p>Due Date: -</p>
        </div>
      </div>
      <div className="space-y-2.5 text-right">
        <h3 className="font-semibold 2xl:text-lg">Billed To</h3>
        <div className="text-muted-foreground space-y-0.5 text-sm">
          {invoice?.sale.customer ? (
            <>
              <p>{invoice.sale.customer.name}</p>
              {invoice.sale.customer.city ? (
                <p>{invoice.sale.customer.city}</p>
              ) : (
                <p>-</p>
              )}
              {invoice.sale.customer.postal_code ? (
                <p>{invoice.sale.customer.postal_code}</p>
              ) : (
                <p>-</p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <p>No customer assigned</p>
              <AddCustomerDialog saleId={invoice?.id}>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="underline hover:cursor-pointer"
                >
                  Add Customer
                </Button>
              </AddCustomerDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceMeta;
