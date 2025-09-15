import { TProductCategory } from "./product-category";
import { TProductVariant } from "./product-variant";
import { TSupplier } from "./supplier";

export type TProduct = {
  id: number;
  sku: string;
  name: string;
  description?: string;
  image: string;
  category_id?: string;
  category?: TProductCategory;
  supplier_id?: string;
  supplier?: TSupplier;
  base_price?: number;
  status: "active" | "inactive";
  created_at: Date;
  updated_at: Date;
  variants: TProductVariant[];
};
