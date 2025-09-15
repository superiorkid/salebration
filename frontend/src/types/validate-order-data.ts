import { TPurchaseOrder } from "./purchase-order";
import { TReorder } from "./reorder";

export type TValidateOrderData = {
  expires_at: number;
  order_id: number;
  supplier_id: number;
  order: TReorder | TPurchaseOrder;
};
