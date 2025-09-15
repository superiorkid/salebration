import { TProductVariant } from "./product-variant";
import { TSupplier } from "./supplier";

export type TPurchaseOrder = {
  id: number;
  purchase_order_number: string;
  supplier_id: number;
  supplier: TSupplier;
  status: string;
  expected_at: Date;
  received_at?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  purchase_order_items: TPurchaseOrderItem[];
};

export type TPurchaseOrderItem = {
  id: number;
  purchase_order_id: number;
  purcase_order: TPurchaseOrder;
  product_variant_id: number;
  product_variant: TProductVariant;
  quantity: number;
  unit_price: number;
  received_quantity: number;
  created_at: Date;
  updated_at: Date;
};
