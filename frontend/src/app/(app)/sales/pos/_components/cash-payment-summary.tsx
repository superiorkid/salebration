"use client";

import { usePosSession } from "@/context/pos-session-context";
import { formatCurrency } from "@/lib/utils";

interface CashPaymentSummaryProps {
  debouncedCashInput: string;
}

const CashPaymentSummary = ({
  debouncedCashInput,
}: CashPaymentSummaryProps) => {
  const { total } = usePosSession();

  const cashPaid = Number(debouncedCashInput) || 0;
  const change = cashPaid - total;

  return (
    <>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Cash Received</span>
        <span className="font-medium">
          {debouncedCashInput ? formatCurrency(cashPaid) : "-"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Change</span>
        <span
          className={
            change < 0
              ? "font-medium text-red-500"
              : change === 0
                ? "font-medium text-gray-600"
                : "font-medium text-green-600"
          }
        >
          {debouncedCashInput
            ? change < 0
              ? "Insufficient"
              : change === 0
                ? "No change"
                : formatCurrency(change)
            : "-"}
        </span>
      </div>
    </>
  );
};

export default CashPaymentSummary;
