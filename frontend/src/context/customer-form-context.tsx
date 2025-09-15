"use client";

import { TCustomer } from "@/app/(app)/sales/customer-schema";
import React, { createContext, useContext, useState } from "react";

interface CustomerFormProviderProps {
  children: React.ReactNode;
}

type CustomerFormContextType = {
  customerData: TCustomer | undefined;
  setCustomerData: React.Dispatch<React.SetStateAction<TCustomer | undefined>>;
  resetCustomerData: () => void;
};

const CustomerFormContext = createContext<CustomerFormContextType | undefined>(
  undefined,
);

const CustomerFormProvider = ({ children }: CustomerFormProviderProps) => {
  const [customerData, setCustomerData] = useState<TCustomer | undefined>(
    undefined,
  );

  const resetCustomerData = () => {
    setCustomerData(undefined);
  };

  return (
    <CustomerFormContext.Provider
      value={{ customerData, setCustomerData, resetCustomerData }}
    >
      {children}
    </CustomerFormContext.Provider>
  );
};

export const useCustomerForm = () => {
  const context = useContext(CustomerFormContext);
  if (!context) {
    throw new Error(
      "useCustomerFormContext must be used within a CustomerFormProvider",
    );
  }
  return context;
};

export default CustomerFormProvider;
