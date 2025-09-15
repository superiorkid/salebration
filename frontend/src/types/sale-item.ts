import { TProductVariant } from "./product-variant";
import { TSale } from "./sale";

export type TSaleItem = {
  id: number;
  sale_id: number;
  sale: TSale;
  product_variant_id: number;
  product_variant: TProductVariant;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
};
