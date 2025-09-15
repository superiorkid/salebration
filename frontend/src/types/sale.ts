import { TransactionStatusEnum } from "@/enums/transaction-status";
import { TPayment } from "./payment";
import { TSaleItem } from "./sale-item";
import { TUser } from "./user";
import { TInvoice } from "./invoice";
import { TCustomer } from "./customer";

export type TSale = {
  id: number;
  operator_id: number;
  operator: TUser;
  total: number;
  paid: number;
  change: number;
  status: TransactionStatusEnum;
  created_at: Date;
  updated_at: Date;
  items: TSaleItem[];
  payments: TPayment[];
  invoice: TInvoice;
  customer?: TCustomer;
};
