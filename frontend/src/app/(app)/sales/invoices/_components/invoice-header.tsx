"use client";

import { useDetailCompany } from "@/hooks/tanstack/company";
import { MailIcon, PhoneIcon } from "lucide-react";

const InvoiceHeader = () => {
  const { company } = useDetailCompany();

  return (
    <div className="bg-foreground text-background flex justify-between p-6">
      <div className="flex items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">{company?.data?.display_name}</h1>
          {/* <p className="text-sm opacity-90">Apotek</p> */}
          <div className="pt-1">
            <p className="flex items-center gap-2 text-sm">
              <MailIcon className="h-4 w-4" />
              {company?.data?.email}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <PhoneIcon className="h-4 w-4" />
              {company?.data?.phone}
            </p>
          </div>
        </div>
      </div>

      <div className="line-clamp-3 max-w-[158px] text-right text-sm">
        {company?.data?.address}
      </div>
    </div>
  );
};

export default InvoiceHeader;
