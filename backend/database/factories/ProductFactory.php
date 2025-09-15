<?php

namespace Database\Factories;

use App\Enums\StatusEnum;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sku' => strtoupper('SKU-' . Str::random(6)),
            "name" => $this->faker->words(2, true),
            "slug" => $this->faker->unique()->slug(),
            "description" => $this->faker->optional()->paragraph(),
            "base_price" => $this->faker->numberBetween(1000, 1000000),
            'status' => $this->faker->randomElement(array_column(StatusEnum::cases(), 'value')),
            'category_id' => ProductCategory::query()->inRandomOrder()->value("id"),
            'supplier_id' => Supplier::query()->inRandomOrder()->value("id"),
        ];
    }

    public function configure(): self
    {
        return $this->afterCreating(function (Product $product) {
            $product
                ->addMediaFromUrl('https://picsum.photos/200/300')
                ->toMediaCollection('product_image');
        });
    }
}
