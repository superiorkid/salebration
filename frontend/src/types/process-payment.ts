import { PaymentMethodEnum } from "@/enums/payment";

export type TProcessPayment = {
  items: Item[];
  total: number;
  paid: number;
  change: number;
  payment: {
    method: PaymentMethodEnum;
    amount: number;
  };
  customer?: Customer;
};

export type Item = {
  productVariantId: number;
  quantity: number;
  price: number;
  subtotal: number;
};

export type Customer = {
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
};
