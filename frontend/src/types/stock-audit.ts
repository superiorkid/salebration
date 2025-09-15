import { TProductVariant } from "./product-variant";
import { TUser } from "./user";

export type TStockAudit = {
  id: number;
  product_variant_id: number;
  product_variant: TProductVariant;
  audited_by_id: number;
  auditor: TUser;
  system_quantity: number;
  counted_quantity: number;
  difference: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
};
