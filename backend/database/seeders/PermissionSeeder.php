<?php

namespace Database\Seeders;

use App\Constants\Permissions;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create all permissions from the Permissions constants
        foreach (Permissions::all() as $permission) {
            Permission::query()
                ->firstOrCreate(["name" => $permission]);
        }

        // create admin role and assign all permissions
        $adminRole = Role::query()->firstOrCreate(["name" => "admin"]);
        $adminRole->givePermissionTo(Permission::all());

        $this->createDefaultRoles();
    }

    protected function createDefaultRoles(): void
    {
        // cashier role with basic permissions
        $cashierRole = Role::query()->firstOrCreate(["name" => "cashier"]);
        $cashierPermissions = [
            // frontend pages access
            Permissions::VIEW_DASHBOARD_PAGE,
            Permissions::VIEW_CUSTOMERS_PAGE,
            Permissions::VIEW_INVOICES_PAGE,
            Permissions::VIEW_SALES_PAGE,
            Permissions::VIEW_TRANSACTIONS_PAGE,

            // Product access
            Permissions::VIEW_PRODUCT_VARIANTS,
            Permissions::SEARCH_PRODUCT_VARIANTS,

            // Sales operations
            Permissions::VIEW_SALES,
            Permissions::CREATE_SALES,
            Permissions::VIEW_SALE_DETAILS,
            Permissions::PROCESS_REFUNDS,

            // Customer access (for sales)
            Permissions::VIEW_CUSTOMERS,

            // Invoice access
            Permissions::VIEW_INVOICES,
            Permissions::DOWNLOAD_INVOICES,
            Permissions::PREVIEW_INVOICES,

            // Sales KPIs
            Permissions::VIEW_SALES_KPIS,

            Permissions::VIEW_COMPANY,
        ];
        $cashierRole->syncPermissions($cashierPermissions);
    }
}
