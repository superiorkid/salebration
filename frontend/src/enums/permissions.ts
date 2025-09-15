export enum PermissionsEnum {
  // Users
  VIEW_USERS = "view_users",
  CREATE_USERS = "create_users",
  EDIT_USERS = "edit_users",
  DELETE_USERS = "delete_users",
  BULK_DELETE_USERS = "bulk_delete_users",
  UPDATE_PASSWORD = "update_password",

  // Customers
  VIEW_CUSTOMERS = "view_customers",
  EIDT_CUSTOMERS = "edit_customers",
  DELETE_CUSTOMERS = "delete_customers",
  BULK_DELETE_CUSTOMERS = "bulk_delete_customers",

  // Activity Logs
  VIEW_LOGS = "view_logs",

  // Invoices
  VIEW_INVOICES = "view_invoices",
  DOWNLOAD_INVOICES = "download_invoices",
  PREVIEW_INVOICES = "preview_invoices",

  // Categories
  VIEW_CATEGORIES = "view_categories",
  CREATE_CATEGORIES = "create_categories",
  EDIT_CATEGORIES = "edit_categories",
  DELETE_CATEGORIES = "delete_categories",
  BULK_DELETE_CATEGORIES = "bulk_delete_categories",

  // Suppliers
  VIEW_SUPPLIERS = "view_suppliers",
  CREATE_SUPPLIERS = "create_suppliers",
  EDIT_SUPPLIERS = "edit_suppliers",
  DELETE_SUPPLIERS = "delete_suppliers",
  BULK_DELETE_SUPPLIERS = "bulk_delete_suppliers",

  // Products
  VIEW_PRODUCTS = "view_products",
  CREATE_PRODUCTS = "create_products",
  EDIT_PRODUCTS = "edit_products",
  DELETE_PRODUCTS = "delete_products",

  // Product variants
  VIEW_PRODUCT_VARIANTS = "view_product_variants",
  SEARCH_PRODUCT_VARIANTS = "search_product_variants",

  // Sales
  VIEW_SALES = "view_sales",
  CREATE_SALES = "create_sales",
  VIEW_SALE_DETAILS = "view_sale_details",
  PROCESS_REFUNDS = "process_refunds",
  VIEW_SALES_KPIS = "view_sales_kpis",

  // Reorders
  VIEW_REORDERS = "view_reorders",
  CREATE_REORDERS = "create_reorders",
  EDIT_REORDERS = "edit_reorders",
  DELETE_REORDERS = "delete_reorders",
  RECEIVE_REORDERS = "receive_reorders",
  CANCEL_REORDERS = "cancel_reorders",

  // Purchase Orders
  VIEW_PURCHASE_ORDERS = "view_purchase_orders",
  CREATE_PURCHASE_ORDERS = "create_purchase_orders",
  EDIT_PURCHASE_ORDERS = "edit_purchase_orders",
  DELETE_PURCHASE_ORDERS = "delete_purchase_orders",
  CANCEL_PURCHASE_ORDERS = "cancel_purchase_orders",

  // Purchase order items
  UPDATE_PO_ITEMS = "update_po_items",

  // Stock Audits
  VIEW_STOCK_AUDITS = "view_stock_audits",
  CREATE_STOCK_AUDITS = "create_stock_audits",
  DELETE_STOCK_AUDITS = "delete_stock_audits",

  // Stock History
  VIEW_STOCK_HISTORIES = "view_stock_histories",
  DELETE_STOCK_HISTORIES = "delete_stock_histories",

  // Roles
  VIEW_ROLES = "view_roles",
  ADD_ROLES = "add_roles",
  EDIT_ROLES = "edit_roles",
  DELETE_ROLES = "delete_roles",

  // Reports
  VIEW_SALES_REPORTS = "view_sales_reports",
  EXPORT_SALES_REPORTS = "export_sales_reports",
  VIEW_INVENTORY_REPORTS = "view_inventory_reports",
  EXPORT_INVENTORY_REPORTS = "export_inventory_reports",
  VIEW_FINANCIAL_REPORTS = "view_financial_reports",
  EXPORT_FINANCIAL_REPORTS = "export_financial_reports",
  VIEW_PERMISSIONS = "view_permissions",

  // Frontend page permissions
  VIEW_DASHBOARD_PAGE = "view_dashboard_page",
  VIEW_USERS_PAGE = "view_users_page",
  VIEW_LOGS_PAGE = "view_logs_page",
  VIEW_CUSTOMERS_PAGE = "view_customers_page",
  VIEW_INVOICES_PAGE = "view_invoices_page",
  VIEW_TRANSACTIONS_PAGE = "view_transactions_page",
  VIEW_SALES_PAGE = "view_sales_page",
  VIEW_CATEGORIES_PAGE = "view_categories_page",
  VIEW_SUPPLIERS_PAGE = "view_suppliers_page",
  VIEW_PRODUCTS_PAGE = "view_products_page",
  VIEW_STOCK_MANAGEMENT_PAGE = "view_stock_management_page",
  VIEW_REORDERS_PAGE = "view_reorders_page",
  VIEW_PURCHASE_ORDERS_PAGE = "view_purchase_orders_page",
  VIEW_REPORTS_SALES_PAGE = "view_reports_sales_page",
  VIEW_REPORTS_INVENTORY_PAGE = "view_reports_inventory_page",
  VIEW_REPORTS_FINANCIAL_PAGE = "view_reports_financial_page",
  VIEW_ROLES_PAGE = "view_roles_page",
  VIEW_STOCK_AUDIT_PAGE = "view_stock_audit_page",
  VIEW_AUDIT_HISTORY_PAGE = "view_audit_history_page",
  ADD_USERS_PAGE = "add_users_page",
  EDIT_USERS_PAGE = "edit_users_page",
  EDIT_CUSTOMERS_PAGE = "edit_customers_page",
  DETAIL_TRANSACTIONS_PAGE = "detail_transactions_page",
  ADD_SUPPLIERS_PAGE = "add_suppliers_page",
  EDIT_SUPPLIERS_PAGE = "edit_suppliers_page",
  ADD_PRODUCTS_PAGE = "add_products_page",
  EDIT_PRODUCTS_PAGE = "edit_products_page",
  DETAIL_REORDERS_PAGE = "detail_reorders_page",
  ADD_REORDERS_PAGE = "add_reorders_page",
  ADD_PURCHASE_ORDERS_PAGE = "add_purchase_orders_page",
  DETAIL_PURCHASE_ORDERS_PAGE = "detail_purchase_orders_page",
  ADD_ROLES_PAGE = "add_roles_page",
  ADD_STOCK_AUDIT_PAGE = "add_stock_audit_page",
  EDIT_ROLES_PAGE = "edit_roles_page",
  DETAIL_USERS_PAGE = "detail_users_page",
  VIEW_EXPENSES_CATEGORY_PAGE = "view_expenses_category_page",
  VIEW_EXPENSES_CATEGORY = "view_expenses_category",
  ADD_EXPENSES_CATEGORY = "add_expenses_category",
  DELETE_EXPENSES_CATEGORY = "delete_expenses_category",

  VIEW_EXPENSES_PAGE = "view_expenses_page",
  EDIT_EXPENSES_PAGE = "edit_expenses_page",
  DETAIL_EXPENSES_PAGE = "detail_expenses_page",
  ADD_EXPENSES_PAGE = "add_expenses_page",
  VIEW_EXPENSES = "view_expenses",
  ADD_EXPENSES = "add_expenses",
  EDIT_EXPENSES = "edit_expenses",
  DELETE_EXPENSES = "delete_expenses",
  VIEW_COMPANY_PAGE = "view_company_page",
  EDIT_COMPANY_PAGE = "edit_company_page",
  VIEW_COMPANY = "view_company",
  EDIT_COMPANY = "edit_company",
  ASSIGN_CUSTOMER_TO_SALE = "assign_customer_to_sale",

  QRIS_PAYMENT = "qris_payment",
}
