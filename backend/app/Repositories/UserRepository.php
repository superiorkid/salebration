<?php

namespace App\Repositories;

use App\DTO\CreateUserDTO;
use App\DTO\UpdatePasswordDTO;
use App\DTO\UpdateUserDTO;
use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryInterface
{
    public function findOneByEmail(string $email): ?User
    {
        return User::query()
            ->where('email', $email)
            ->with(["roles"])
            ->first();
    }

    public function findOneById(int $id): ?User
    {
        return User::query()
            ->with(["roles"])
            ->find($id);
    }

    public function findOneByName(string $name): ?User
    {
        return User::query()
            ->where("name", $name)
            ->with(["roles"])
            ->first();
    }

    public function findMany(): Collection
    {
        return User::query()
            ->orderBy("created_at")
            ->with(['roles'])
            ->get();
    }

    public function create(CreateUserDTO $createUserDTO): User
    {
        $newUser = User::query()->create([
            "name" => $createUserDTO->name,
            "email" => $createUserDTO->email,
            "password" => Hash::make($createUserDTO->password),
            "email_verified_at" => now()
        ]);

        $newUser->assignRole($createUserDTO->role);
        return $newUser->load("roles");
    }

    public function update(User $user, UpdateUserDTO $updateUserDTO): User
    {
        $user->update([
            "name" => $updateUserDTO->name ?? $user->name,
            "email" => $updateUserDTO->email ?? $user->email,
            "email_verified_at" => $updateUserDTO->email_verified_at ?? $user->email_verified_at,
            "refresh_token" => $updateUserDTO->refresh_token ?? $user->refresh_token,
        ]);

        if (filled($updateUserDTO->role) && $updateUserDTO->role !== $user->roles->first()?->id) {
            $user->syncRoles([$updateUserDTO->role]);
        }

        return $user->load('roles', 'permissions');
    }

    public function deleteMany(array $ids): void
    {
        User::query()->whereIn("id", $ids)->delete();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function updatePassword(User $user, UpdatePasswordDTO $updatePasswordDTO): void
    {
        $user->update([
            "password" => Hash::make($updatePasswordDTO->password),
        ]);
    }
}
