<?php

namespace App\Repositories;

use App\DTO\RoleDTO;
use App\Interfaces\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Role;

class RoleRepository implements RoleRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findMany(): Collection
    {
        return Role::query()
            ->with(['permissions'])
            ->get();
    }

    public function findOneById(int $id): ?Role
    {
        return Role::query()
            ->with(['permissions'])
            ->find($id);
    }

    public function findOneByName(string $name): ?Role
    {
        return Role::query()
            ->where('name', $name)
            ->with(['permissions'])
            ->first();
    }

    public function create(RoleDTO $roleDTO): Role
    {
        $newRole = Role::query()
            ->create([
                'name' => $roleDTO->name,
                'guard_name' => 'web'
            ]);

        if (filled($roleDTO->permissions)){
            $newRole->permissions()->sync($roleDTO->permissions);
        }

        return $newRole->load('permissions');
    }

    public function update(Role $role, RoleDTO $roleDTO): void
    {
        $role->update([
            'name' => $roleDTO->name,
        ]);
        $role->permissions()->sync($roleDTO->permissions ?? []);
    }

    public function delete(Role $role): void
    {
        $role->delete();
    }
}
