import { TSale } from "./sale";

export type TCustomer = {
  id: number;
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  sales: TSale[];
};
