<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $companyConfig = config("app.company");

        return [
            'name' => $companyConfig['company_name'] ?? $this->faker->company(),
            'display_name' => $companyConfig['display_name'] ?? $this->faker->company(),
            'phone' => $companyConfig['phone'] ?? $this->faker->phoneNumber(),
            'email' => $companyConfig['email'] ?? $this->faker->companyEmail(),
            'address' => $companyConfig['address'] ?? $this->faker->address(),
            'owner_name' => $companyConfig['owner_name'] ?? $this->faker->name(),
        ];
    }
}
