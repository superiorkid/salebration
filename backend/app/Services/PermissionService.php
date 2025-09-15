<?php

namespace App\Services;

use App\Interfaces\PermissionRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;

class PermissionService
{
    protected PermissionRepositoryInterface $permissionRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        PermissionRepositoryInterface $permissionRepositoryInterface
    )
    {
        $this->permissionRepositoryInterface = $permissionRepositoryInterface;
    }

    public function permissions(): JsonResponse
    {
        try {
            $permissions = $this->permissionRepositoryInterface->findMany();
            return response()
                ->json([
                    "success" => true,
                    "message" => "Permissions retrieved successfully.",
                    "data" => $permissions
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
