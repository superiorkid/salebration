import { TSale } from "./sale";

export type TInvoice = {
  id: number;
  sale_id: number;
  sale: TSale;
  number: string;
  issued_at: Date;
  created_at: Date;
  updated_at: Date;
};
