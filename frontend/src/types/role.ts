import { TPermission } from "./permission";

export type TRole = {
  id: number;
  name: string;
  guard_name: string;
  created_at: Date;
  updated_at: Date;
  permissions: TPermission[];
};
