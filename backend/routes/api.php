<?php

use App\Constants\Permissions;
use App\Enums\TokenAbilityEnum;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\PurchaseOrderItemController;
use App\Http\Controllers\ReorderController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockAuditController;
use App\Http\Controllers\StockHistoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ValidateTokenController;
use App\Http\Controllers\XenditController;
use Illuminate\Support\Facades\Route;

Route::prefix("auth")
    ->controller(AuthController::class)
    ->group(function () {
        Route::post('/sign-in', 'signIn');

        Route::middleware(['auth:sanctum', 'ability:' . TokenAbilityEnum::ISSUE_ACCESS_TOKEN->value])
            ->group(function () {
                Route::get('/refresh', 'refresh');
            });

        Route::middleware('auth:sanctum')->group(function () {
            Route::delete('/sign-out', 'logOut');
            Route::get('/me', 'getSession');
        });
    });

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix("users")
        ->controller(UserController::class)
        ->group(function () {
            Route::get('/', 'users')->middleware('permission:'.Permissions::VIEW_USERS);
            Route::post('/', 'createUser')->middleware('permission:'.Permissions::CREATE_USERS);
            Route::get('/{user_id}', 'detailUser')->middleware('permission:'.Permissions::VIEW_USERS);
            Route::put('/{user_id}', 'updateUser')->middleware('permission:'.Permissions::EDIT_USERS);
            Route::put('/{user_id}/password', 'updatePassword')->middleware('permission:'.Permissions::UPDATE_PASSWORD);
            Route::delete('/{user_id}', 'deleteUser')->middleware('permission:'.Permissions::DELETE_USERS);
        });

    Route::prefix("customers")
        ->controller(CustomerController::class)
        ->group(function () {
            Route::get('/', 'customers')->middleware('permission:'.Permissions::VIEW_CUSTOMERS);
            Route::get('/{customer_id}', 'detailCustomer')->middleware('permission:'.Permissions::VIEW_CUSTOMERS);
            Route::post('/{customer_id}', 'editCustomer')->middleware('permission:'.Permissions::EDIT_CUSTOMERS);
            Route::delete('/{customer_id}', 'deleteCustomer')->middleware('permission:'.Permissions::DELETE_CUSTOMERS);
        });

    Route::prefix("logs")
        ->controller(ActivityLogController::class)
        ->group(function () {
            Route::get('/', 'activityLogs')->middleware('permission:'.Permissions::VIEW_LOGS);
        });

    Route::prefix("invoices")
        ->controller(InvoiceController::class)
        ->group(function () {
            Route::get('/', 'invoice')->middleware('permission:'.Permissions::VIEW_INVOICES);
            Route::post('/{invoice_id}/download-pdf', 'download')->middleware('permission:'.Permissions::DOWNLOAD_INVOICES);
            Route::post('/{invoice_id}/preview-pdf', 'preview')->middleware('permission:'.Permissions::PREVIEW_INVOICES);
        });


    Route::prefix("categories")
        ->controller(ProductCategoryController::class)
        ->group(function () {
            Route::get('/', 'categories')->middleware('permission:'.Permissions::VIEW_CATEGORIES);
            Route::post('/', 'createCategory')->middleware('permission:'.Permissions::CREATE_CATEGORIES);
            Route::delete('/', "bulkDeleteCategory")->middleware('permission:'.Permissions::BULK_DELETE_CATEGORIES);
            Route::get('/{category_id}', 'detailCategory')->middleware('permission:'.Permissions::VIEW_CATEGORIES);
            Route::put('/{category_id}', 'updateCategory')->middleware('permission:'.Permissions::EDIT_CATEGORIES);
            Route::delete('/{category_id}', 'deleteCategory')->middleware('permission:'.Permissions::DELETE_CATEGORIES);
        });

    Route::prefix("suppliers")
        ->controller(SupplierController::class)
        ->group(function () {
            Route::get('/', 'suppliers')->middleware('permission:'.Permissions::VIEW_SUPPLIERS);
            Route::post('/', 'createSupplier')->middleware('permission:'.Permissions::CREATE_SUPPLIERS);
            Route::delete('/', 'deleteBulkSupplier')->middleware('permission:'.Permissions::BULK_DELETE_SUPPLIERS);
            Route::get('/{supplier_id}', 'detailSupplier')->middleware('permission:'.Permissions::VIEW_SUPPLIERS);
            Route::post('/{supplier_id}', 'updateSupplier')->middleware('permission:'.Permissions::EDIT_SUPPLIERS);
            Route::delete('/{supplier_id}', 'deleteSupplier')->middleware('permission:'.Permissions::DELETE_SUPPLIERS);
        });

    Route::prefix("products")
        ->controller(ProductController::class)
        ->group(function () {
            Route::get('/', 'products')->middleware('permission:'.Permissions::VIEW_PRODUCTS);
            Route::post('/', 'createProduct')->middleware('permission:'.Permissions::CREATE_PRODUCTS);
            Route::get('/{product_id}', 'detailProduct')->middleware('permission:'.Permissions::VIEW_PRODUCTS);
            Route::post('/{product_id}', 'updateProduct')->middleware('permission:'.Permissions::EDIT_PRODUCTS);
            Route::delete('/{product_id}', 'deleteProduct')->middleware('permission:'.Permissions::DELETE_PRODUCTS);
        });

    Route::prefix('product-variants')
        ->controller(ProductVariantController::class)
        ->group(function () {
            Route::get('/', 'stocks')->middleware('permission:'.Permissions::VIEW_PRODUCT_VARIANTS);
            Route::get('/search', "searchProducts")->middleware('permission:'.Permissions::SEARCH_PRODUCT_VARIANTS);
            Route::get("/{variant_id}", "detailProductVariant")->middleware('permission:'.Permissions::VIEW_PRODUCT_VARIANTS);
        });

    Route::prefix("sales")
        ->controller(SaleController::class)
        ->group(function() {
            Route::get('/kpis/today', 'todayKpis')->middleware('permission:'.Permissions::VIEW_SALES_KPIS);
            Route::get('/{sale_id}', 'detailSale')->middleware('permission:'.Permissions::VIEW_SALE_DETAILS);
            Route::put("/{sale_id}/assign-customer", 'assignCustomer')->middleware('permission:'.Permissions::ASSIGN_CUSTOMER_TO_SALE);
            Route::post('/{sale_id}/refund', 'refundSale')->middleware('permission:'.Permissions::PROCESS_REFUNDS);
            Route::get('/', 'sales')->middleware('permission:'.Permissions::VIEW_SALES);
            Route::post('/', 'createSale')->middleware('permission:'.Permissions::CREATE_SALES);
        });

    Route::prefix("reorders")
        ->controller(ReorderController::class)
        ->group(function () {
            Route::get('/', 'reorders')->middleware('permission:'.Permissions::VIEW_REORDERS);
            Route::post('/', 'createReorder')->middleware('permission:'.Permissions::CREATE_REORDERS);
            Route::get('/{reorder_id}', 'detailReorder')->middleware('permission:'.Permissions::VIEW_REORDERS);
            Route::delete('/{reorder_id}', 'deleteReorder')->middleware('permission:'.Permissions::DELETE_REORDERS);
            Route::post('/{reorder_id}/receive', 'markAsReceive')->middleware('permission:'.Permissions::RECEIVE_REORDERS);
            Route::post('/{reorder_id}/cancel', 'markAsCancel')->middleware('permission:'.Permissions::CANCEL_REORDERS);
        });

    Route::prefix("purchase-orders")
        ->controller(PurchaseOrderController::class)
        ->group(function() {
            Route::get('/', 'purchaseOrders')->middleware('permission:'.Permissions::VIEW_PURCHASE_ORDERS);
            Route::post('/', 'createPurchaseOrder')->middleware('permission:'.Permissions::CREATE_PURCHASE_ORDERS);
            Route::get('/{purchase_order_id}', 'detailPurchaseOrder')->middleware('permission:'.Permissions::VIEW_PURCHASE_ORDERS);
            Route::delete('/{purchase_order_id}', 'deletePurchaseOrder')->middleware('permission:'.Permissions::DELETE_PURCHASE_ORDERS);
            Route::post('/{purchase_order_id}/cancel', 'markAsCancel')->middleware('permission:'.Permissions::CANCEL_PURCHASE_ORDERS);
        });

    Route::prefix("purchase-order-items")
        ->controller(PurchaseOrderItemController::class)
        ->group(function() {
           Route::put('/{purchase_order_item_id}', 'updateReceivedQuantity')->middleware('permission:'.Permissions::UPDATE_PO_ITEMS);
        });

    Route::prefix("stock-audits")
        ->controller(StockAuditController::class)
        ->group(function() {
            Route::get('/', 'stockAudits')->middleware('permission:'.Permissions::VIEW_STOCK_AUDITS);
            Route::post('/', 'createStockAudit')->middleware('permission:'.Permissions::CREATE_STOCK_AUDITS);
            Route::delete('{stock_audit_id}', 'deleteStockAudit')->middleware('permission:'.Permissions::DELETE_STOCK_AUDITS);
        });

    Route::prefix("stock-histories")
        ->controller(StockHistoryController::class)
        ->group(function() {
            Route::get('/', 'stockHistories')->middleware('permission:'.Permissions::VIEW_STOCK_HISTORIES);
            Route::get('/{stock_history_id}', 'detailStockHistory')->middleware('permission:'.Permissions::VIEW_STOCK_HISTORIES);
            Route::delete('/{stock_history_id}', 'deleteStockHistory')->middleware('permission:'.Permissions::DELETE_STOCK_HISTORIES);
        });

    Route::prefix("roles")
        ->controller(RoleController::class)
        ->group(function() {
            Route::get('/', 'roles')->middleware('permission:'.Permissions::VIEW_ROLES);
            Route::post('/', 'createRole')->middleware('permission:'.Permissions::ADD_ROLES);
            Route::get('/{role_id}', 'detailRole')->middleware('permission:'.Permissions::VIEW_ROLES);
            Route::put('/{role_id}', 'editRole')->middleware('permission:'.Permissions::EDIT_ROLES);
            Route::delete('/{role_id}', 'deleteRole')->middleware('permission:'.Permissions::DELETE_ROLES);
        });

    Route::prefix("permissions")
        ->controller(PermissionController::class)
        ->group(function() {
            Route::get('/', 'permissions')->middleware('permission:'.Permissions::VIEW_PERMISSIONS);
        });

    Route::prefix("expense-categories")
        ->controller(ExpenseCategoryController::class)
        ->group(function() {
            Route::get("/", "categories")->middleware('permission:'.Permissions::VIEW_EXPENSES_CATEGORY);
            Route::post("/", "createCategory")->middleware('permission:'.Permissions::ADD_EXPENSES_CATEGORY);
            Route::delete("/{category_id}", "deleteCategory")->middleware('permission:'.Permissions::DELETE_EXPENSES_CATEGORY);
        });

    Route::prefix("expenses")
        ->controller(ExpenseController::class)
        ->group(function() {
           Route::get("/", 'expenses')->middleware('permission:'.Permissions::VIEW_EXPENSES);
           Route::post("/", 'createExpense')->middleware('permission:'.Permissions::ADD_EXPENSES);
           Route::get("/{expense_id}", 'detailExpense')->middleware('permission:'.Permissions::VIEW_EXPENSES);
           Route::post("/{expense_id}", "editExpense")->middleware('permission:'.Permissions::EDIT_EXPENSES);
           Route::delete("/{expense_id}", "deleteExpense")->middleware('permission:'.Permissions::DELETE_EXPENSES);
        });

    Route::prefix("company")
        ->controller(CompanyController::class)
        ->group(function() {
            Route::get("/", 'companyInformation')->middleware('permission:'.Permissions::VIEW_COMPANY);
            Route::post("/", 'setCompanyInformation')->middleware('permission:'.Permissions::EDIT_COMPANY);
        });

    Route::prefix("dashboard")
        ->controller(DashboardController::class)
        ->group(function() {
            Route::get("metrics", "dashboardMetrics");
        });

    Route::prefix("xendit")
        ->controller(XenditController::class)
        ->group(function() {
           Route::post("/invoice", "createInvoice")->middleware('permission:'.Permissions::QRIS_PAYMENT);
        });
});

Route::prefix("reorders")
    ->controller(ReorderController::class)
    ->group(function () {
        Route::post('/{reorder_id}/accept', 'markAsAccept');
        Route::post('/{reorder_id}/reject', 'markAsReject');
    });

Route::prefix("purchase-orders")
    ->controller(PurchaseOrderController::class)
    ->group(function () {
        Route::post('/{purchase_order_id}/accept', 'markAsAccept');
        Route::post('/{purchase_order_id}/reject', 'markAsReject');
    });

Route::post("/validate-order-token", [ValidateTokenController::class, 'validateOrderToken']);
Route::post("/webhooks/xendit/invoice-paid", [XenditController::class, 'createWebhookInvoicePaid']);

Route::prefix("reports")
    ->controller(ReportController::class)
    ->group(function() {
        Route::prefix("sales")->group(function () {
            Route::get('/', 'salesReport')->middleware(['auth:sanctum', 'permission:'.Permissions::VIEW_SALES_REPORTS]);
            Route::get("/export", 'salesReportExport');
        });

        Route::prefix('inventory')->group(function () {
            Route::get('/', 'inventoryReport')->middleware(['auth:sanctum', 'permission:'.Permissions::VIEW_INVENTORY_REPORTS]);
            Route::get("/export", 'inventoryReportExport');
        });

        Route::prefix("financial")->group(function () {
            Route::get('/', 'financialReport')->middleware(['auth:sanctum', 'permission:'.Permissions::VIEW_FINANCIAL_REPORTS]);
            Route::get("/export", 'financialReportExport');
        });
    });
