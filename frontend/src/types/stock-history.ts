import { StockHistoryTypeEnum } from "@/enums/stock-hisotry-type";
import { TSale } from "./sale";
import { TPurchaseOrder } from "./purchase-order";
import { TReorder } from "./reorder";
import { TStockAudit } from "./stock-audit";
import { TRefund } from "@/app/(app)/sales/transactions/refund-schema";
import { TUser } from "./user";

export type TStockHistory = {
  id: number;
  product_variant_id: number;
  performed_by_id: number;
  performed_by: TUser;
  type: StockHistoryTypeEnum;
  quantity_before: number;
  quantity_change: number;
  quantity_after: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  reference: TSale | TPurchaseOrder | TReorder | TStockAudit | TRefund | null;
  reference_id: number;
  reference_type: string;
};
