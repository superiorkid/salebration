<?php

namespace App\Constants;

class Permissions
{
    // Frontend page permissions
    const VIEW_DASHBOARD_PAGE = 'view_dashboard_page';
    const VIEW_USERS_PAGE = 'view_users_page';
    const ADD_USERS_PAGE = 'add_users_page';
    const EDIT_USERS_PAGE = 'edit_users_page';
    const DETAIL_USERS_PAGE = 'detail_users_page';
    const VIEW_CUSTOMERS_PAGE = 'view_customers_page';
    const EDIT_CUSTOMERS_PAGE = 'edit_customers_page';
    const VIEW_LOGS_PAGE = 'view_logs_page';
    const VIEW_INVOICES_PAGE = 'view_invoices_page';
    const VIEW_TRANSACTIONS_PAGE = 'view_transactions_page';
    const DETAIL_TRANSACTIONS_PAGE = 'detail_transactions_page';
    const VIEW_SALES_PAGE = 'view_sales_page';
    const VIEW_CATEGORIES_PAGE = 'view_categories_page';
    const VIEW_SUPPLIERS_PAGE = 'view_suppliers_page';
    const ADD_SUPPLIERS_PAGE = 'add_suppliers_page';
    const EDIT_SUPPLIERS_PAGE = 'edit_suppliers_page';
    const VIEW_PRODUCTS_PAGE = 'view_products_page';
    const ADD_PRODUCTS_PAGE = 'add_products_page';
    const EDIT_PRODUCTS_PAGE= 'edit_products_page';
    const VIEW_STOCK_MANAGEMENT_PAGE = 'view_stock_management_page';
    const VIEW_REORDERS_PAGE = 'view_reorders_page';
    const DETAIL_REORDERS_PAGE = 'detail_reorders_page';
    const ADD_REORDERS_PAGE = 'add_reorders_page';
    const VIEW_PURCHASE_ORDERS_PAGE = 'view_purchase_orders_page';
    const ADD_PURCHASE_ORDERS_PAGE = 'add_purchase_orders_page';
    const DETAIL_PURCHASE_ORDERS_PAGE = 'detail_purchase_orders_page';
    const VIEW_REPORTS_SALES_PAGE = 'view_reports_sales_page';
    const VIEW_REPORTS_INVENTORY_PAGE = 'view_reports_inventory_page';
    const VIEW_REPORTS_FINANCIAL_PAGE = 'view_reports_financial_page';
    const VIEW_ROLES_PAGE = 'view_roles_page';
    const ADD_ROLES_PAGE = 'add_roles_page';
    const EDIT_ROLES_PAGE = 'edit_roles_page';
    const VIEW_STOCK_AUDIT_PAGE = 'view_stock_audit_page';
    const ADD_STOCK_AUDIT_PAGE = 'add_stock_audit_page';
    const VIEW_AUDIT_HISTORY_PAGE= 'view_audit_history_page';

    // Users
    const VIEW_USERS = 'view_users';
    const CREATE_USERS = 'create_users';
    const EDIT_USERS = 'edit_users';
    const DELETE_USERS = 'delete_users';
    const BULK_DELETE_USERS = 'bulk_delete_users';
    const UPDATE_PASSWORD=  "update_password";

    // Customers
    const VIEW_CUSTOMERS = 'view_customers';
    const EDIT_CUSTOMERS = 'edit_customers';
    const DELETE_CUSTOMERS = 'delete_customers';
    const BULK_DELETE_CUSTOMERS = 'bulk_delete_customers';

    // Activity Logs
    const VIEW_LOGS = 'view_logs';

    // Invoices
    const VIEW_INVOICES = 'view_invoices';
    const DOWNLOAD_INVOICES = 'download_invoices';
    const PREVIEW_INVOICES = 'preview_invoices';

    // Categories
    const VIEW_CATEGORIES = 'view_categories';
    const CREATE_CATEGORIES = 'create_categories';
    const EDIT_CATEGORIES = 'edit_categories';
    const DELETE_CATEGORIES = 'delete_categories';
    const BULK_DELETE_CATEGORIES = 'bulk_delete_categories';

    // Suppliers
    const VIEW_SUPPLIERS = 'view_suppliers';
    const CREATE_SUPPLIERS = 'create_suppliers';
    const EDIT_SUPPLIERS = 'edit_suppliers';
    const DELETE_SUPPLIERS = 'delete_suppliers';
    const BULK_DELETE_SUPPLIERS = 'bulk_delete_suppliers';

    // Products
    const VIEW_PRODUCTS = 'view_products';
    const CREATE_PRODUCTS = 'create_products';
    const EDIT_PRODUCTS = 'edit_products';
    const DELETE_PRODUCTS = 'delete_products';

    // Product Variants
    const VIEW_PRODUCT_VARIANTS = 'view_product_variants';
    const SEARCH_PRODUCT_VARIANTS = 'search_product_variants';

    // Sales
    const VIEW_SALES = 'view_sales';
    const CREATE_SALES = 'create_sales';
    const VIEW_SALE_DETAILS = 'view_sale_details';
    const PROCESS_REFUNDS = 'process_refunds';
    const VIEW_SALES_KPIS = 'view_sales_kpis';

    // Reorders
    const VIEW_REORDERS = 'view_reorders';
    const CREATE_REORDERS = 'create_reorders';
    const EDIT_REORDERS = 'edit_reorders';
    const DELETE_REORDERS = 'delete_reorders';
    const RECEIVE_REORDERS = 'receive_reorders';
    const CANCEL_REORDERS = 'cancel_reorders';

    // Purchase Orders
    const VIEW_PURCHASE_ORDERS = 'view_purchase_orders';
    const CREATE_PURCHASE_ORDERS = 'create_purchase_orders';
    const EDIT_PURCHASE_ORDERS = 'edit_purchase_orders';
    const DELETE_PURCHASE_ORDERS = 'delete_purchase_orders';
    const CANCEL_PURCHASE_ORDERS = 'cancel_purchase_orders';

    // Purchase Order Items
    const UPDATE_PO_ITEMS = 'update_po_items';

    // Stock Audits
    const VIEW_STOCK_AUDITS = 'view_stock_audits';
    const CREATE_STOCK_AUDITS = 'create_stock_audits';
    const DELETE_STOCK_AUDITS = 'delete_stock_audits';

    // Stock Histories
    const VIEW_STOCK_HISTORIES = 'view_stock_histories';
    const DELETE_STOCK_HISTORIES = 'delete_stock_histories';

    // Roles
    const VIEW_ROLES = 'view_roles';
    const ADD_ROLES = 'add_roles';
    const EDIT_ROLES = 'edit_roles';
    const DELETE_ROLES = 'delete_roles';

    // Reports
    const VIEW_SALES_REPORTS = 'view_sales_reports';
    const EXPORT_SALES_REPORTS = 'export_sales_reports';
    const VIEW_INVENTORY_REPORTS = 'view_inventory_reports';
    const EXPORT_INVENTORY_REPORTS = 'export_inventory_reports';
    const VIEW_FINANCIAL_REPORTS = 'view_financial_reports';
    const EXPORT_FINANCIAL_REPORTS = 'export_financial_reports';


    // permissions
    const VIEW_PERMISSIONS = 'view_permissions';

    // expense category
    const VIEW_EXPENSES_CATEGORY_PAGE = 'view_expenses_category_page';
    const VIEW_EXPENSES_CATEGORY = 'view_expenses_category';
    const ADD_EXPENSES_CATEGORY = 'add_expenses_category';
    const DELETE_EXPENSES_CATEGORY = 'delete_expenses_category';

    // expenses
    const ADD_EXPENSES = 'add_expenses';
    const VIEW_EXPENSES_PAGE = "view_expenses_page";
    const ADD_EXPENSES_PAGE = "add_expenses_page";
    const EDIT_EXPENSES_PAGE = 'edit_expenses_page';
    const DETAIL_EXPENSES_PAGE = "detail_expenses_page";

    const VIEW_EXPENSES = 'view_expenses';
    const EDIT_EXPENSES = 'edit_expenses';
    const DELETE_EXPENSES = 'delete_expenses';

    // company
    const VIEW_COMPANY_PAGE = "view_company_page";
    const EDIT_COMPANY_PAGE = "edit_company_page";
    const VIEW_COMPANY = 'view_company';
    const EDIT_COMPANY = 'edit_company';

    const ASSIGN_CUSTOMER_TO_SALE = 'assign_customer_to_sale';
    const QRIS_PAYMENT = "qris_payment";


    public static function pagePermissions(): array
    {
        return [
            self::VIEW_DASHBOARD_PAGE,
            self::VIEW_USERS_PAGE,
            self::VIEW_LOGS_PAGE,
            self::VIEW_CUSTOMERS_PAGE,
            self::VIEW_INVOICES_PAGE,
            self::VIEW_TRANSACTIONS_PAGE,
            self::VIEW_SALES_PAGE,
            self::VIEW_CATEGORIES_PAGE,
            self::VIEW_SUPPLIERS_PAGE,
            self::VIEW_PRODUCTS_PAGE,
            self::VIEW_STOCK_MANAGEMENT_PAGE,
            self::VIEW_REORDERS_PAGE,
            self::VIEW_PURCHASE_ORDERS_PAGE,
            self::VIEW_REPORTS_SALES_PAGE,
            self::VIEW_REPORTS_INVENTORY_PAGE,
            self::VIEW_REPORTS_FINANCIAL_PAGE,
            self::VIEW_ROLES_PAGE,
            self::VIEW_STOCK_AUDIT_PAGE,
            self::VIEW_AUDIT_HISTORY_PAGE,
            self::ADD_USERS_PAGE,
            self::EDIT_USERS_PAGE,
            self::EDIT_CUSTOMERS_PAGE,
            self::DETAIL_TRANSACTIONS_PAGE,
            self::ADD_SUPPLIERS_PAGE,
            self::EDIT_SUPPLIERS_PAGE,
            self::ADD_PRODUCTS_PAGE,
            self::EDIT_PRODUCTS_PAGE,
            self::DETAIL_REORDERS_PAGE,
            self::ADD_REORDERS_PAGE,
            self::ADD_PURCHASE_ORDERS_PAGE,
            self::DETAIL_PURCHASE_ORDERS_PAGE,
            self::ADD_ROLES_PAGE,
            self::ADD_STOCK_AUDIT_PAGE,
            self::EDIT_ROLES_PAGE,
            self::DETAIL_USERS_PAGE,
            self::VIEW_EXPENSES_PAGE,
            self::ADD_EXPENSES_PAGE,
            self::EDIT_EXPENSES_PAGE,
            self::DETAIL_EXPENSES_PAGE,
            self::VIEW_EXPENSES_CATEGORY_PAGE,
            self::VIEW_COMPANY_PAGE,
            self::EDIT_COMPANY_PAGE,
        ];
    }

    public static function all(): array
    {
        return array_merge(self::pagePermissions(),  [
            self::QRIS_PAYMENT,
            self::ASSIGN_CUSTOMER_TO_SALE,

            // Company
            self::VIEW_COMPANY,
            self::EDIT_COMPANY,

            // Users
            self::VIEW_USERS,
            self::CREATE_USERS,
            self::EDIT_USERS,
            self::DELETE_USERS,
            self::BULK_DELETE_USERS,
            self::UPDATE_PASSWORD,

            // Customers
            self::VIEW_CUSTOMERS,
            self::EDIT_CUSTOMERS,
            self::DELETE_CUSTOMERS,
            self::BULK_DELETE_CUSTOMERS,

            // Activity Logs
            self::VIEW_LOGS,

            // Invoices
            self::VIEW_INVOICES,
            self::DOWNLOAD_INVOICES,
            self::PREVIEW_INVOICES,

            // Categories
            self::VIEW_CATEGORIES,
            self::CREATE_CATEGORIES,
            self::EDIT_CATEGORIES,
            self::DELETE_CATEGORIES,
            self::BULK_DELETE_CATEGORIES,

            // Suppliers
            self::VIEW_SUPPLIERS,
            self::CREATE_SUPPLIERS,
            self::EDIT_SUPPLIERS,
            self::DELETE_SUPPLIERS,
            self::BULK_DELETE_SUPPLIERS,

            // Products
            self::VIEW_PRODUCTS,
            self::CREATE_PRODUCTS,
            self::EDIT_PRODUCTS,
            self::DELETE_PRODUCTS,

            // Product Variants
            self::VIEW_PRODUCT_VARIANTS,
            self::SEARCH_PRODUCT_VARIANTS,

            // Sales
            self::VIEW_SALES,
            self::CREATE_SALES,
            self::VIEW_SALE_DETAILS,
            self::PROCESS_REFUNDS,
            self::VIEW_SALES_KPIS,

            // Reorders
            self::VIEW_REORDERS,
            self::CREATE_REORDERS,
            self::EDIT_REORDERS,
            self::DELETE_REORDERS,
            self::RECEIVE_REORDERS,
            self::CANCEL_REORDERS,

            // Purchase Orders
            self::VIEW_PURCHASE_ORDERS,
            self::CREATE_PURCHASE_ORDERS,
            self::EDIT_PURCHASE_ORDERS,
            self::DELETE_PURCHASE_ORDERS,
            self::CANCEL_PURCHASE_ORDERS,

            // Purchase Order Items
            self::UPDATE_PO_ITEMS,

            // Stock Audits
            self::VIEW_STOCK_AUDITS,
            self::CREATE_STOCK_AUDITS,
            self::DELETE_STOCK_AUDITS,

            // Stock Histories
            self::VIEW_STOCK_HISTORIES,
            self::DELETE_STOCK_HISTORIES,

            // Roles
            self::VIEW_ROLES,
            self::ADD_ROLES,
            self::EDIT_ROLES,
            self::DELETE_ROLES,

            // Reports
            self::VIEW_SALES_REPORTS,
            self::EXPORT_SALES_REPORTS,
            self::VIEW_INVENTORY_REPORTS,
            self::EXPORT_INVENTORY_REPORTS,
            self::VIEW_FINANCIAL_REPORTS,
            self::EXPORT_FINANCIAL_REPORTS,

            // permissions
            self::VIEW_PERMISSIONS,

            // expenses categories
            self::VIEW_EXPENSES_CATEGORY,
            self::ADD_EXPENSES_CATEGORY,
            self::DELETE_EXPENSES_CATEGORY,

            // expenses
            self::VIEW_EXPENSES,
            self::ADD_EXPENSES,
            self::EDIT_EXPENSES,
            self::DELETE_EXPENSES,
        ]);
    }
}
