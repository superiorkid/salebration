"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import CustomerForm from "./customer-form";

interface AddCustomerDialogProps {
  children: React.ReactNode;
  saleId?: number;
}

const AddCustomerDialog = ({ children, saleId }: AddCustomerDialogProps) => {
  const [openDialog, openDialogToggle] = useState<boolean>(false);

  return (
    <Dialog open={openDialog} onOpenChange={openDialogToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[45rem]">
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <UserPlusIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle>
              {saleId ? "Link Customer to Sale" : "Add New Customer"}
            </DialogTitle>
            <DialogDescription>
              {saleId
                ? "Connect this sale to an existing customer or create a new customer profile"
                : "Fill in customer details to create a new profile in your system"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="mt-4">
          <CustomerForm
            onFormSubmit={() => openDialogToggle(false)}
            saleId={saleId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
