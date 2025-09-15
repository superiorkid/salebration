import { TExpenseCategory } from "./expense-category";
import { TMedia } from "./media";

export type TExpense = {
  id: number;
  category_id: number;
  category: TExpenseCategory;
  title: string;
  description?: string;
  amount: number;
  paid_at: Date;
  created_at: Date;
  updated_at: Date;
  media: TMedia[];
};
