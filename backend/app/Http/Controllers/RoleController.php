<?php

namespace App\Http\Controllers;

use App\DTO\RoleDTO;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    protected RoleService $roleService;

    public function __construct(
        RoleService $roleService
    )
    {
        $this->roleService = $roleService;
    }

    public function roles(): JsonResponse
    {
        return $this->roleService->roles();
    }

    public function createRole(RoleDTO $roleDTO): JsonResponse
    {
        return $this->roleService->createRole($roleDTO);
    }

    public function detailRole(string $role_id): JsonResponse
    {
        return $this->roleService->detailRole((int) $role_id);
    }

    public function editRole(string $role_id, RoleDTO $roleDTO): JsonResponse
    {
        return $this->roleService->editRole((int) $role_id, $roleDTO);
    }

    public function deleteRole(string $role_id): JsonResponse
    {
        return $this->roleService->deleteRole((int) $role_id);
    }
}
