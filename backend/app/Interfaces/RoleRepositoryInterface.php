<?php

namespace App\Interfaces;

use App\DTO\RoleDTO;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Role;

interface RoleRepositoryInterface
{
    public function findMany(): Collection;
    public function findOneById(int $id): ?Role;
    public function findOneByName(string $name): ?Role;
    public function create(RoleDTO $roleDTO): Role;
    public function update(Role $role, RoleDTO $roleDTO): void;
    public function delete(Role $role): void;
}
