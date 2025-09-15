<?php

namespace App\Services;

use App\DTO\RoleDTO;
use App\Interfaces\RoleRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class RoleService
{
    protected RoleRepositoryInterface $roleRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        RoleRepositoryInterface $roleRepositoryInterface
    )
    {
        $this->roleRepositoryInterface = $roleRepositoryInterface;
    }

    public function roles(): JsonResponse
    {
        try {
            $roles = $this->roleRepositoryInterface->findMany();
            return response()->json([
                'success' => true,
                'message' => 'Roles retrieved successfully.',
                'data' => $roles
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e){
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createRole(RoleDTO $roleDTO): JsonResponse
    {
        $role = $this->roleRepositoryInterface->findOneByName($roleDTO->name);
        if (filled($role)){
            return response()->json([
                'success' => false,
                'message' => 'Role already exist.'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            DB::beginTransaction();
            $this->roleRepositoryInterface->create($roleDTO);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role created successfully.',
            ], JsonResponse::HTTP_CREATED);
        } catch (Exception $e) {
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function editRole(int $roleId, RoleDTO $roleDTO): JsonResponse
    {
        $role = $this->roleRepositoryInterface->findOneById($roleId);
        if (empty($role)){
            return response()->json([
                'success' => false,
                'message' => 'Role not found.'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            DB::beginTransaction();
            $this->roleRepositoryInterface->update($role, $roleDTO);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role updated successfully.',
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e){
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteRole(int $roleId): JsonResponse
    {
        $role = $this->roleRepositoryInterface->findOneById($roleId);
        if (empty($role)){
            return response()->json([
                'success' => false,
                'message' => 'Role not found.'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->roleRepositoryInterface->delete($role);
            return response()->json([
                'success' => true,
                'message' => 'Role deleted successfully.'
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e){
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detailRole(int $detailRole): JsonResponse
    {
        try {
            $role = $this->roleRepositoryInterface->findOneById($detailRole);
            if (empty($role)){
                return response()->json([
                    'success' => false,
                    'message' => 'Role not found.'
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'message' => 'Role retrieved successfully.',
                'data' => $role
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
