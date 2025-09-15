import { TMedia } from "./media";

export type TCompany = {
  id: number;
  media: TMedia[];
  name: string;
  display_name: string;
  email: string;
  phone: string;
  website?: string;
  owner_name?: string;
  address: string;
  created_at: Date;
  updated_at: Date;
};
