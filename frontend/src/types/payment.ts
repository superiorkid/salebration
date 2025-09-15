import { PaymentMethodEnum } from "@/enums/payment";
import { TSale } from "./sale";

export type TPayment = {
  id: number;
  sale_id: number;
  sale: TSale;
  method: PaymentMethodEnum;
  amount: number;
  paid_at: Date;
  created_at: Date;
  updated_at: Date;
};
