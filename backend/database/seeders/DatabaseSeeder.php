<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CompanySeeder::class,
            PermissionSeeder::class,
            UserSeeder::class,
            ProductCategorySeeder::class,
            SupplierSeeder::class,
            ProductSeeder::class,
            ProductVariantSeeder::class,
            ExpenseCategorySeeder::class,
        ]);
    }
}
