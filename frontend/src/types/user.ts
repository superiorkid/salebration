import { TRole } from "./role";

export type TUser = {
  id: number;
  email: string;
  name: string;
  password?: string;
  email_verified_at?: Date;
  refresh_token?: string;
  remember_token?: string;
  created_at: Date;
  updated_at: Date;
  roles?: TRole[];
};
