"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePosSession } from "@/context/pos-session-context";
import { formatCurrency } from "@/lib/utils";

interface CashAmountInputProps {
  cashInput: string;
  debouncedCashInput: string;
  handleCashInputChange: (amount: string) => void;
}

const CashAmountInput = ({
  cashInput,
  debouncedCashInput,
  handleCashInputChange,
}: CashAmountInputProps) => {
  const { total } = usePosSession();

  const cashPaid = Number(debouncedCashInput) || 0;

  return (
    <div className="space-y-2">
      <Label htmlFor="cashAmount" className="text-sm font-medium">
        Enter Cash Amount
      </Label>
      <div className="relative flex rounded-md shadow-xs">
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">
          Rp
        </span>
        <Input
          id="cashAmount"
          className="-me-px h-10 rounded-e-none ps-9 text-lg shadow-none"
          placeholder="0.00"
          type="text"
          value={cashInput}
          onChange={(event) => {
            const value = event.target.value;
            handleCashInputChange(value);
          }}
        />
        <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
          IDR
        </span>
      </div>
      {debouncedCashInput && cashPaid < total && (
        <p className="text-sm text-red-500">
          Please enter at least {formatCurrency(total)}
        </p>
      )}
    </div>
  );
};

export default CashAmountInput;
