<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::query()->inRandomOrder()->first();
        $additionalPrice = $this->faker->numberBetween(1000, 1000000);

        return [
            'product_id' => $product->id,
            'attribute' => $this->faker->randomElement(['size']),
            'value' => $this->faker->randomElement(['S', 'M', 'L']),
            'sku_suffix' => "-" . strtoupper(Str::random(5)),
            'barcode' => $this->faker->unique()->ean13(),
            'additional_price' => $additionalPrice,
            'selling_price' => $product->base_price + $additionalPrice + $this->faker->numberBetween(1000, 50000),
            'quantity' => $this->faker->numberBetween(0, 100),
            'min_stock_level' => $this->faker->numberBetween(5, 20),
        ];
    }
}
