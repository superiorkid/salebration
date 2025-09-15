import { TUser } from "./user";

export type TActivityLog = {
  id: number;
  user_id?: number;
  user?: TUser;
  action: string;
  description: string;
  subject_type: string;
  subject_id: string;
  data?: string;
  created_at: Date;
  updated_at: Date;
};
