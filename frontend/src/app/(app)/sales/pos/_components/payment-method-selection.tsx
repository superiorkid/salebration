"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCustomerForm } from "@/context/customer-form-context";
import { usePosSession } from "@/context/pos-session-context";
import { PaymentMethodEnum } from "@/enums/payment";
import { PermissionsEnum } from "@/enums/permissions";
import { useCheckout, useProcessPayment } from "@/hooks/tanstack/sale";
import { useDebounce } from "@/hooks/use-debounce";
import { usePermission } from "@/hooks/use-permission";
import { formatCurrency } from "@/lib/utils";
import { TProcessPayment } from "@/types/process-payment";
import {
  CreditCardIcon,
  Loader2Icon,
  LockIcon,
  QrCodeIcon,
  WalletIcon,
} from "lucide-react";
import React, { useState } from "react";
import CashAmountInput from "./cash-amount-input";
import CashPaymentSummary from "./cash-payment-summary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PaymentMethodSelectionsProps {
  children: React.ReactNode;
}

const PaymentMethodSelections = ({
  children,
}: PaymentMethodSelectionsProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentSelected, setPaymentSelected] =
    useState<PaymentMethodEnum | null>(null);
  const [cashInput, setCashInput] = useState("");

  const debouncedCashInput = useDebounce(cashInput, 300);
  const { items, total, clearItems } = usePosSession();
  const { customerData, resetCustomerData } = useCustomerForm();
  const { checkout, isPending: checkoutPending } = useCheckout();

  const { isPending: isProcessing, processTransactionMutaton } =
    useProcessPayment({
      onPaymentComplete: () => {
        setOpenDialog(false);
        setPaymentSelected(null);
        setCashInput("");
        clearItems();
        resetCustomerData();
      },
    });

  const cashPaid = Number(debouncedCashInput) || 0;
  const change = cashPaid - total;
  const isCashSufficient = cashPaid >= total;

  const canHandlePayWithCash = usePermission(PermissionsEnum.CREATE_SALES);
  const canHandlePayWithQRis = usePermission(PermissionsEnum.QRIS_PAYMENT);
  const hasAnyPermission = canHandlePayWithCash || canHandlePayWithQRis;

  const buildCustomerPayload = () =>
    customerData && {
      customer: {
        name: customerData.name,
        ...(customerData.companyName && {
          companyName: customerData.companyName,
        }),
        ...(customerData.email && { email: customerData.email }),
        ...(customerData.phone && { phone: customerData.phone }),
        ...(customerData.address && { address: customerData.address }),
        ...(customerData.city && { city: customerData.city }),
        ...(customerData.postalCode && { postalCode: customerData.postalCode }),
        ...(customerData.notes && { notes: customerData.notes }),
      },
    };

  const buildItemPayload = () =>
    items.map((item) => ({
      productVariantId: item.variant.id,
      price:
        Number(item.variant.product.base_price) +
        Number(item.variant.additional_price),
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

  const pay = ({
    method,
    paid,
    change,
    isExternal = false,
  }: {
    method: PaymentMethodEnum;
    paid?: number;
    change?: number;
    isExternal?: boolean;
  }) => {
    const payload = {
      total,
      payment: { amount: total, method },
      items: buildItemPayload(),
      ...buildCustomerPayload(),
      ...(paid !== undefined && { paid }),
      ...(change !== undefined && { change }),
    };

    if (isExternal) {
      checkout(payload);
    } else {
      processTransactionMutaton(payload as TProcessPayment);
    }
  };

  const handleCheckout = () => {
    pay({ method: PaymentMethodEnum.QRIS, isExternal: true });
  };

  const handleConfirmPayment = () => {
    pay({
      method: PaymentMethodEnum.CASH,
      paid: cashPaid,
      change,
    });
  };

  const handleCashInputChange = (amount: string) => {
    if (amount === "" || /^\d*$/.test(amount)) setCashInput(amount);
  };

  const handlePaymentSelect = (method: PaymentMethodEnum) => {
    setPaymentSelected(method);
    if (method === PaymentMethodEnum.CASH) {
      setTimeout(() => document.getElementById("cashAmount")?.focus(), 100);
    }
  };

  const resetDialog = () => {
    setTimeout(() => {
      setPaymentSelected(null);
      setCashInput("");
    }, 300);
  };

  const renderPaymentOptions = () => (
    <div className="grid grid-cols-1 gap-3">
      {!hasAnyPermission ? (
        <Alert variant="destructive">
          <LockIcon className="h-5 w-5" />
          <AlertTitle className="text-base font-semibold">
            Access Denied
          </AlertTitle>
          <AlertDescription className="text-muted-foreground text-sm">
            You do not have permission to make a payment. Please contact an
            administrator.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {canHandlePayWithCash && (
            <Button
              variant="outline"
              className="h-10 justify-start px-4 text-left 2xl:h-10"
              onClick={() => handlePaymentSelect(PaymentMethodEnum.CASH)}
            >
              <WalletIcon className="mr-3 h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Cash</span>
                <span className="text-muted-foreground text-xs">
                  Pay with physical money
                </span>
              </div>
            </Button>
          )}
          {canHandlePayWithQRis && (
            <Button
              variant="outline"
              className="h-14 justify-start px-4 text-left"
              onClick={handleCheckout}
              disabled={checkoutPending}
            >
              <CreditCardIcon className="mr-3 h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">QRIS</span>
                <span className="text-muted-foreground text-xs">
                  Pay with QRIS
                </span>
              </div>
            </Button>
          )}
        </>
      )}
    </div>
  );

  const renderPaymentSummary = () => (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Total Amount</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>
        {paymentSelected === PaymentMethodEnum.CASH && (
          <CashPaymentSummary debouncedCashInput={debouncedCashInput} />
        )}
      </div>

      {paymentSelected === PaymentMethodEnum.CASH && (
        <CashAmountInput
          cashInput={cashInput}
          debouncedCashInput={debouncedCashInput}
          handleCashInputChange={handleCashInputChange}
        />
      )}

      {/* {paymentSelected === PaymentMethodEnum.CARD && (
        <InfoCard
          icon={<CreditCardIcon className="mx-auto mb-3 h-8 w-8" />}
          color="blue"
          title="Process payment using card terminal"
          description="Customer will insert/swipe/tap their card"
        />
      )} */}

      {paymentSelected === PaymentMethodEnum.QRIS && (
        <InfoCard
          icon={<QrCodeIcon className="mx-auto mb-3 h-8 w-8" />}
          color="green"
          title="Display QR code for customer to scan"
          description="Automatic payment detection"
        />
      )}

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setPaymentSelected(null)}
        >
          Back
        </Button>
        <Button
          className="flex-1"
          onClick={handleConfirmPayment}
          disabled={
            isProcessing ||
            (paymentSelected === PaymentMethodEnum.CASH &&
              (!debouncedCashInput || !isCashSufficient))
          }
        >
          {isProcessing ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Payment"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);
        if (!open) resetDialog();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-lg font-medium">
            {paymentSelected ? "Complete Payment" : "Select Payment Method"}
          </DialogTitle>
        </DialogHeader>
        {paymentSelected ? renderPaymentSummary() : renderPaymentOptions()}
      </DialogContent>
    </Dialog>
  );
};

const InfoCard = ({
  icon,
  color,
  title,
  description,
}: {
  icon: React.ReactNode;
  color: "blue" | "green";
  title: string;
  description: string;
}) => {
  const bg = {
    blue: "bg-blue-50 dark:bg-blue-900",
    green: "bg-green-50 dark:bg-green-900",
  }[color];

  const text = {
    blue: "text-blue-800 dark:text-blue-200",
    green: "text-green-800 dark:text-green-200",
  }[color];

  return (
    <div className={`rounded-lg p-4 text-center text-sm ${bg} ${text}`}>
      {icon}
      <p>{title}</p>
      <p className="mt-1 text-xs">{description}</p>
    </div>
  );
};

export default PaymentMethodSelections;
