"use client";

import { useValidateOrderData } from "@/context/validate-reorder-data-context";
import useValidateOrderToken from "@/hooks/tanstack/validate-order-token";
import { TValidateOrderData } from "@/types/validate-order-data";
import { Loader2Icon } from "lucide-react";
import React, { useEffect } from "react";
import ValidateTokenError from "./validate-token-error";

interface ValidateOrderTokenProps {
  children: React.ReactNode;
  type: "purchase-order" | "reorder";
  token: string;
  orderId: number;
}

const ValidateOrderToken = ({
  children,
  orderId,
  token,
  type,
}: ValidateOrderTokenProps) => {
  const { onTokenDataChange } = useValidateOrderData();

  const { isPending, validateOrderTokenMutation, isError, data } =
    useValidateOrderToken();

  useEffect(() => {
    if (token && orderId && type) {
      validateOrderTokenMutation({ token, orderId, type });
    }
  }, [token, orderId, type]);

  useEffect(() => {
    if (!isPending && !isError && data?.data) {
      onTokenDataChange(data?.data as TValidateOrderData);
    }
  }, [isPending, isError, data?.data]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full border-b-2 border-gray-400 p-4">
            <Loader2Icon className="h-8 w-8 text-gray-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            Validating Order
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we verify your order details
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <ValidateTokenError />;
  }

  return children;
};

export default ValidateOrderToken;
