import { PermissionsEnum } from "@/enums/permissions";
import { LucideIcon } from "lucide-react";

export type TSidebarMenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  permission?: PermissionsEnum;
};

export type TSidebarMenu = {
  groupName: string | null;
  items: TSidebarMenuItem[];
};
