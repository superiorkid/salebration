"use client";

import { TValidateOrderData } from "@/types/validate-order-data";
import React, { createContext, useContext, useState } from "react";

type ValidateOrerContextType = {
  tokenData: TValidateOrderData | undefined;
  onTokenDataChange: (tokenData: TValidateOrderData) => void;
  clearTokenData: () => void;
};

const ValidateOrderContext = createContext<ValidateOrerContextType | undefined>(
  undefined,
);

interface ValidateOrderDataContextProps {
  children: React.ReactNode;
}

const ValidateOrderDataProvider = ({
  children,
}: ValidateOrderDataContextProps) => {
  const [tokenData, setTokenData] = useState<TValidateOrderData | undefined>(
    undefined,
  );

  const onTokenDataChange = (values: TValidateOrderData) => {
    setTokenData(values);
  };

  const clearTokenData = () => {
    setTokenData(undefined);
  };

  return (
    <ValidateOrderContext.Provider
      value={{ tokenData, clearTokenData, onTokenDataChange }}
    >
      {children}
    </ValidateOrderContext.Provider>
  );
};

export const useValidateOrderData = () => {
  const context = useContext(ValidateOrderContext);
  if (!context) {
    throw new Error(
      "useValidateOrderData must be used within a ValidateOrderDataProvider",
    );
  }
  return context;
};

export default ValidateOrderDataProvider;
