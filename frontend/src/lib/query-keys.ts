import { FinancialPeriodEnum } from "@/enums/financial-period";
import { TFinancialReportParams } from "@/types/financial-report";
import { TInventoryFilters } from "@/types/inventory-report";
import { TSaleFilters } from "@/types/sale-report";

export const supplierKeys = {
  all: ["suppliers"] as const,
  detail: (supplierId: number) =>
    [...supplierKeys.all, { supplierId }] as const,
};

export const productKeys = {
  all: ["products"] as const,
  detail: (productId: number) => [...productKeys.all, { productId }] as const,
};

export const productVariantKeys = {
  all: ["product-variants"] as const,
  detail: (productVariantId: number) =>
    [...productVariantKeys.all, { productVariantId }] as const,
  search: (keyword: string, supplierId: number) =>
    [...productKeys.all, { keyword, supplierId }] as const,
};

export const productCategoriesKeys = {
  all: ["product-categories"] as const,
  detail: (productCategoriesId: number) =>
    [...productCategoriesKeys.all, { productCategoriesId }] as const,
  list: (filters: { parent_only: boolean }) =>
    [...productCategoriesKeys.all, { ...filters }] as const,
};

export const userKeys = {
  all: ["users"] as const,
  detail: (userId: number) => [...userKeys.all, "detail", { userId }] as const,
};

export const transactionKeys = {
  all: ["transactions"] as const,
  detail: (transactionId: number) =>
    [...transactionKeys.all, "detail", { transactionId }] as const,
  kpi: () => [...transactionKeys.all, { kpi: "kpi" }] as const,
};

export const invoiceKeys = {
  all: ["invoices"] as const,
  detail: (invoiceNumber: string) =>
    [...invoiceKeys.all, { invoiceNumber }] as const,
};

export const activityLogKeys = {
  all: ["activity-logs"] as const,
};

export const customerKeys = {
  all: ["customers"] as const,
  search: (searchKeyword: string) =>
    [...customerKeys.all, { searchKeyword }] as const,
  detail: (customerId: number) =>
    [...customerKeys.all, { customerId }] as const,
};

export const reorderKeys = {
  all: ["reorders"] as const,
  detail: (reorderId: number) => [...reorderKeys.all, { reorderId }] as const,
};

export const purchaseOrdersKeys = {
  all: ["purchase-orders"] as const,
  detail: (purchaseOrderId: number) =>
    [...purchaseOrdersKeys.all, { purchaseOrderId }] as const,
};

export const stockAuditKeys = {
  all: ["stock-audits"] as const,
  allByVariantId: (productVariantId: number) =>
    [...stockAuditKeys.all, { productVariantId }] as const,
};

export const stockHistoryKeys = {
  all: ["stock-histories"] as const,
  allByVariantId: (productVariantId: number) =>
    [...stockHistoryKeys.all, { productVariantId }] as const,
};

export const reportKeys = {
  sales: ["sales-report"] as const,
  salesWithFilters: (filters?: TSaleFilters) =>
    [...reportKeys.sales, { ...filters }] as const,
  inventory: ["inventory-report"] as const,
  inventoryWithFilters: (filters?: TInventoryFilters) =>
    [...reportKeys.inventory, { ...filters }] as const,
  financial: ["financial-report"] as const,
  financialWithFilters: (filters?: TFinancialReportParams) =>
    [
      ...reportKeys.financial,
      { ...filters, period: filters?.period || FinancialPeriodEnum.MONTHLY },
    ] as const,
};

export const roleKeys = {
  all: ["roles"] as const,
  detail: (roleId: number) => [...roleKeys.all, { roleId }],
};

export const permissionKeys = {
  all: ["permissions"] as const,
};

export const expenseCategoryKeys = {
  all: ["expense-categories"] as const,
};

export const expenseKeys = {
  all: ["expenses"] as const,
  detail: (expenseId: number) => [...expenseKeys.all, { expenseId }] as const,
};

export const companyKeys = {
  all: ["company"] as const,
};
