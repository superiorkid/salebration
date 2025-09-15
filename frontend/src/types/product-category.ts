export type TProductCategory = {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  parent?: TProductCategory;
  created_at: Date;
  updated_at: Date;
};
