import { PermissionsEnum } from "@/enums/permissions";
import { hasPermission } from "@/lib/utils";
import { TSidebarMenu } from "@/types/sidebar-menu";
import { TUser } from "@/types/user";
import {
  ArrowUpDownIcon,
  BlocksIcon,
  Building2Icon,
  ClipboardListIcon,
  ContainerIcon,
  DollarSignIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogsIcon,
  NotepadTextIcon,
  PackageIcon,
  ReceiptTextIcon,
  RepeatIcon,
  ScrollTextIcon,
  ShieldIcon,
  TagIcon,
  TagsIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useSession } from "./tanstack/auth";

export function useSidebarMenus() {
  const pathname = usePathname();
  const { session, isPending } = useSession();

  const menuGroups = useMemo<TSidebarMenu[]>(
    () => [
      {
        groupName: null,
        items: [
          {
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboardIcon,
            isActive: pathname === "/",
            permission: PermissionsEnum.VIEW_DASHBOARD_PAGE,
          },
          {
            title: "Activity Logs",
            url: "/logs",
            icon: LogsIcon,
            isActive: pathname === "/logs",
            permission: PermissionsEnum.VIEW_LOGS_PAGE,
          },
          {
            title: "Customers",
            url: "/customers",
            icon: UsersIcon,
            isActive: pathname === "/customers",
            permission: PermissionsEnum.VIEW_CUSTOMERS_PAGE,
          },
        ],
      },
      {
        groupName: "Sales",
        items: [
          {
            title: "POS",
            url: "/sales/pos",
            icon: DollarSignIcon,
            isActive: pathname === "/sales/pos",
            permission: PermissionsEnum.VIEW_SALES_PAGE,
          },
          {
            title: "Transactions",
            url: "/sales/transactions",
            icon: ArrowUpDownIcon,
            isActive: pathname.includes("/sales/transactions"),
            permission: PermissionsEnum.VIEW_TRANSACTIONS_PAGE,
          },
          {
            title: "Invoices",
            url: "/sales/invoices",
            icon: ReceiptTextIcon,
            isActive: pathname === "/sales/invoices",
            permission: PermissionsEnum.VIEW_INVOICES_PAGE,
          },
        ],
      },
      {
        groupName: "Inventory",
        items: [
          {
            title: "Products",
            url: "/inventory/products",
            icon: PackageIcon,
            isActive: pathname.includes("/inventory/products"),
            permission: PermissionsEnum.VIEW_PRODUCTS_PAGE,
          },
          {
            title: "Stock Management",
            url: "/inventory/stock-managements",
            icon: BlocksIcon,
            isActive: pathname.includes("/inventory/stock-managements"),
            permission: PermissionsEnum.VIEW_STOCK_MANAGEMENT_PAGE,
          },
          {
            title: "Reorders",
            url: "/inventory/reorders",
            icon: RepeatIcon,
            isActive: pathname.includes("/inventory/reorders"),
            permission: PermissionsEnum.VIEW_REORDERS_PAGE,
          },
          {
            title: "Purchase Orders",
            url: "/inventory/purchase-orders",
            icon: ClipboardListIcon,
            isActive: pathname.includes("/inventory/purchase-orders"),
            permission: PermissionsEnum.VIEW_PURCHASE_ORDERS_PAGE,
          },
          {
            title: "Suppliers",
            url: "/inventory/suppliers",
            icon: ContainerIcon,
            isActive: pathname.includes("/inventory/suppliers"),
            permission: PermissionsEnum.VIEW_SUPPLIERS_PAGE,
          },
          {
            title: "Categories",
            url: "/inventory/categories",
            icon: TagIcon,
            isActive: pathname.includes("/inventory/categories"),
            permission: PermissionsEnum.VIEW_CATEGORIES_PAGE,
          },
        ],
      },
      {
        groupName: "Finance",
        items: [
          {
            title: "Expenses",
            url: "/finance/expenses",
            icon: WalletIcon,
            isActive: pathname.includes("/finance/expenses"),
            permission: PermissionsEnum.VIEW_EXPENSES_PAGE,
          },
          {
            title: "Expense Categories",
            url: "/finance/expense-categories",
            icon: TagsIcon,
            isActive: pathname.includes("/finance/expense-categories"),
            permission: PermissionsEnum.VIEW_EXPENSES_CATEGORY_PAGE,
          },
        ],
      },

      {
        groupName: "Reports",
        items: [
          {
            title: "Sales Reports",
            url: "/reports/sales",
            icon: FileTextIcon,
            isActive: pathname.includes("/reports/sales"),
            permission: PermissionsEnum.VIEW_REPORTS_SALES_PAGE,
          },
          {
            title: "Inventory Reports",
            url: "/reports/inventory",
            icon: NotepadTextIcon,
            isActive: pathname.includes("/reports/inventory"),
            permission: PermissionsEnum.VIEW_REPORTS_INVENTORY_PAGE,
          },
          {
            title: "Financial Reports",
            url: "/reports/financial",
            icon: ScrollTextIcon,
            isActive: pathname.includes("/reports/financial"),
            permission: PermissionsEnum.VIEW_REPORTS_FINANCIAL_PAGE,
          },
        ],
      },
      {
        groupName: "Settings",
        items: [
          {
            title: "Users Management",
            url: "/settings/users",
            icon: UsersIcon,
            isActive: pathname.includes("/settings/users"),
            permission: PermissionsEnum.VIEW_USERS_PAGE,
          },
          {
            title: "Roles Management",
            url: "/settings/roles",
            icon: ShieldIcon,
            isActive: pathname.includes("/settings/roles"),
            permission: PermissionsEnum.VIEW_ROLES_PAGE,
          },
          {
            title: "App Settings",
            url: "/settings/company",
            icon: Building2Icon,
            isActive: pathname.includes("/settings/company"),
            permission: PermissionsEnum.VIEW_COMPANY_PAGE,
          },
          // {
          //   title: "Tax Settings",
          //   url: "#",
          //   icon: PercentIcon,
          //   isActive: false,
          //   // permission: PermissionsEnum.VIEW_TAX_SETTINGS_PAGE,
          // },
          // {
          //   title: "Payment Methods",
          //   url: "#",
          //   icon: CreditCardIcon,
          //   isActive: false,
          //   // permission: PermissionsEnum.VIEW_PAYMENT_METHODS_PAGE,
          // },
          // {
          //   title: "Printer Settings",
          //   url: "#",
          //   icon: PrinterIcon,
          //   isActive: false,
          //   // permission: PermissionsEnum.VIEW_PRINTER_SETTINGS_PAGE,
          // },
        ],
      },
    ],
    [pathname],
  );

  const filteredGroup = menuGroups
    .map((menuGroup) => {
      const items = menuGroup.items.filter((item) => {
        if (!item.permission) return true;
        return hasPermission(session?.data as TUser, item.permission);
      });

      return {
        ...menuGroup,
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  return { filteredGroup, isPending };
}
