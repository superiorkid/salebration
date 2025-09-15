export type TSupplier = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: "active" | "inactive";
  profile_image?: string;
  created_at: Date;
  updated_at: Date;
};
