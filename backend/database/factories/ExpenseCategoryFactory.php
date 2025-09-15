<?php

namespace Database\Factories;

use App\Models\ExpenseCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExpenseCategory>
 */
class ExpenseCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pharmacyExpenses = [
            'Staff Salaries',
            'Electricity',
            'Water Bill',
            'Rent',
            'Medical Waste Disposal',
            'Pharmacy License',
            'Insurance Premiums',
            'Cleaning Services',
            'Internet Bill',
            'Equipment Maintenance',
            'POS Software',
            'Local Advertising',
            'Bank Fees',
            'Miscellaneous'
        ];

        return [
            'name' => $this->generateUniqueCategory($pharmacyExpenses),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function generateUniqueCategory(array $categories): string
    {
        $name = $this->faker->unique()->randomElement($categories);

        while (ExpenseCategory::query()->where('name', $name)->exists()) {
            $name = $this->faker->unique()->randomElement($categories) . ' ' . rand(1, 100);
        }

        return $name;
    }
}
