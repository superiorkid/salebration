<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductCategory::factory()->count(5)->create(["parent_id" => null]);
        ProductCategory::factory()->count(10)->create(["parent_id" => function () {
            return ProductCategory::query()->inRandomOrder()->first()?->id;
        }]);
    }
}
