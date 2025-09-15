import { OrderStatusEnum } from "@/enums/order-status";
import { TProductVariant } from "./product-variant";

export type TReorder = {
  id: number;
  product_variant_id: number;
  product_variant: TProductVariant;
  cancelled_by_id?: number;
  purchase_order_number: string;
  quantity: number;
  expected_at: Date;
  received_at?: Date;
  accepted_at?: Date;
  rejected_at?: Date;
  cost_per_item: number;
  notes?: string;
  acceptance_notes?: string;
  cancellation_reason?: string;
  rejection_reason?: string;
  status: OrderStatusEnum;
  created_at: Date;
  updated_at: Date;
};
