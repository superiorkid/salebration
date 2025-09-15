<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make("password"),
                'email_verified_at' => now()
            ]
        );
        $admin->assignRole('admin');

        $cashier = User::query()->firstOrCreate(
            ['email' => 'cashier@example.com'],
            [
                'name' => 'Cashier User',
                'password' => Hash::make("password"),
                'email_verified_at' => now()
            ]
        );

        $cashier->assignRole('cashier');
    }
}
