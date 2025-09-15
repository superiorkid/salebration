"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCustomerForm } from "@/context/customer-form-context";
import { useCustomers } from "@/hooks/tanstack/customer";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2Icon, SearchIcon, UserPlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CustomerForm from "./customer-form";

const AddCustomer = () => {
  const [openDialog, openDialogToggle] = useState<boolean>(false);

  const [customerSearch, setCustomerSearch] = useState<string>("");
  const customerSearchDebounce = useDebounce(customerSearch, 300);

  const { customers, isPending } = useCustomers(customerSearchDebounce);

  const { customerData, resetCustomerData, setCustomerData } =
    useCustomerForm();

  useEffect(() => {
    if (!!customerData) {
      setCustomerSearch("");
    }
  }, [customerData]);

  return (
    <div className="rounded-xl bg-white shadow-xs">
      {!!customerData ? (
        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="flex-1">
            <p className="font-medium text-gray-900">{customerData.name}</p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
              {customerData.email && <span>{customerData.email}</span>}
              {customerData.phone && <span>{customerData.phone}</span>}
            </div>
          </div>
          <button
            onClick={resetCustomerData}
            className="ml-4 rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-red-500"
            title="Remove customer"
          >
            <XIcon size={16} strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <h1 className="pb-1.5 text-sm font-medium">
            Customer
            <span className="text-muted-foreground">(Optional)</span>
          </h1>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="Search by name, email, or phone..."
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onChange={(event) => {
                const value = event.target.value.trimStart();
                setCustomerSearch(value);
              }}
              value={customerSearch}
            />
            {customerSearch && (
              <button
                onClick={() => setCustomerSearch("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {!!customerSearchDebounce && (
            <div className="absolute top-[73px] left-0 z-10 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
              <Dialog open={openDialog} onOpenChange={openDialogToggle}>
                <DialogTrigger asChild>
                  <button className="flex w-full items-center border-b px-4 py-2 text-left text-sm hover:bg-gray-50">
                    <UserPlusIcon className="mr-2" size={16} strokeWidth={2} />
                    Create new customer: &quot;{customerSearchDebounce}&quot;
                  </button>
                </DialogTrigger>
                <DialogContent className="min-w-[47rem]">
                  <div className="flex flex-col gap-2">
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <UserPlusIcon className="opacity-80" size={16} />
                    </div>
                    <DialogHeader>
                      <DialogTitle className="text-left">
                        Create New Customer
                      </DialogTitle>
                      <DialogDescription className="text-left">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <div className="mt-6">
                    <CustomerForm
                      onFormSubmit={() => {
                        openDialogToggle(false);
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              {isPending ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  <Loader2Icon className="mr-2 inline animate-spin" size={16} />
                  Searching...
                </div>
              ) : customers?.data?.length ? (
                customers.data.map((customer) => (
                  <div
                    key={customer.id}
                    className="cursor-pointer px-4 py-3 hover:bg-gray-50"
                    onClick={() => {
                      setCustomerData({
                        name: customer.name,
                        address: customer.address,
                        city: customer.city,
                        companyName: customer.company_name,
                        email: customer.email,
                        notes: customer.notes,
                        phone: customer.phone,
                        postalCode: customer.postal_code,
                      });
                    }}
                  >
                    <p className="font-medium">{customer.name}</p>
                    <div className="mt-1 flex gap-2 text-xs text-gray-500">
                      {customer.email && <span>{customer.email}</span>}
                      {customer.phone && <span>{customer.phone}</span>}
                    </div>
                  </div>
                ))
              ) : (
                !isPending && (
                  <div className="p-3 text-center text-sm text-gray-500">
                    No existing customers found
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddCustomer;
