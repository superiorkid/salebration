"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { useState } from "react";

const InvoiceSearchInput = () => {
  const [invoiceNumber, setInvoiceNumber] = useQueryState("no", {
    clearOnDefault: true,
  });
  const [inputValue, setInputValue] = useState<string>(invoiceNumber || "");

  const handleSearch = () => {
    setInvoiceNumber(inputValue || null);
  };

  return (
    <div className="flex items-end gap-2 pb-7">
      <div className="max-w-[300px] min-w-[200px] flex-1">
        <Input
          value={inputValue}
          defaultValue={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Invoice #"
          className="h-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
      </div>
      <Button size="sm" className="h-9" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default InvoiceSearchInput;
