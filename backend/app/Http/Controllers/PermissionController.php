<?php

namespace App\Http\Controllers;

use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    protected PermissionService $permissionService;

    public function __construct(
        PermissionService $permissionService
    )
    {
        $this->permissionService = $permissionService;
    }


    public function permissions(): JsonResponse
    {
        return $this->permissionService->permissions();
    }
}
