import { TProduct } from "./product";
import { TReorder } from "./reorder";
import { TSaleItem } from "./sale-item";

export type TProductVariant = {
  id: number;
  attribute: string;
  value: string;
  sku_suffix: string;
  product_id: number;
  product: TProduct;
  barcode?: string;
  additional_price: number;
  selling_price: number;
  min_stock_level: number;
  quantity: number;
  saleItems: TSaleItem[];
  created_at: Date;
  updated_at: Date;
  reorders: TReorder[];
  image: string;
};
