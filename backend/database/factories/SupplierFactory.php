<?php

namespace Database\Factories;

use App\Enums\StatusEnum;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'email' => $this->faker->unique()->companyEmail,
            'phone' => $this->faker->e164PhoneNumber(),
            'address' => $this->faker->address(),
            'status' => $this->faker->randomElement(array_column(StatusEnum::cases(), 'value')),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Supplier $supplier) {
            $supplier
                ->addMediaFromUrl('https://picsum.photos/200/300')
                ->toMediaCollection("supplier_profile_image");
        });
    }
}
