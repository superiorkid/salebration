<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductCategory>
 */
class ProductCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => $this->faker->unique()->words(2, true),
            "description" => $this->faker->sentence(),
            "parent_id" => null,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (ProductCategory $productCategory) {
            if ($productCategory->parent_id === $productCategory->id) {
                $productCategory->parent_id === null;
                $productCategory->save();
            }
        });
    }
}
