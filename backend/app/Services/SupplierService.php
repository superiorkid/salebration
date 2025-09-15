<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\DTO\CreateSupplierDTO;
use App\DTO\DeleteBulkSupplierDTO;
use App\DTO\UpdateSupplierDTO;
use App\Enums\ActivityLogActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\SupplierRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

class SupplierService
{
    protected SupplierRepositoryInterface $supplierRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        SupplierRepositoryInterface $supplierRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface
    )
    {
        $this->supplierRepositoryInterface = $supplierRepositoryInterface;
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }

    public function suppliers(): JsonResponse
    {
        try {
            $suppliers = $this->supplierRepositoryInterface->findAll();

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_SUPPLIER,
                description: "View Suppliers",
                subjectType: "Supplier",
                subjectId: "-",
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Get supplier successfully",
                    "data" => $suppliers->toResourceCollection()
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createSupplier(CreateSupplierDTO $createSupplierDTO): JsonResponse
    {
        $supplier = $this->supplierRepositoryInterface->findOneByEmail($createSupplierDTO->email);
        if ($supplier) {
            return response()
                ->json([
                    "success" => false,
                    "message" => "Supplier already exist",
                ], JsonResponse::HTTP_CONFLICT);
        }

        try {
            $newSupplier = $this->supplierRepositoryInterface->create($createSupplierDTO);
            if ($createSupplierDTO->profile_image) {
                $file = $createSupplierDTO->profile_image;
                $newSupplier->uploadImage($file, "supplier_profile_image");
            }

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::CREATE_SUPPLIER,
                description: "Create Suppliers",
                subjectType: "Supplier",
                subjectId: $newSupplier->id,
                data: json_encode($createSupplierDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Supplier created successfully",
                ], JsonResponse::HTTP_CREATED);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);

        }
    }

    public function detailSupplier(int $supplier_id): JsonResponse
    {
        try {
            $supplier = $this->supplierRepositoryInterface->findOneById($supplier_id);
            if (!$supplier) {
                return response()
                    ->json([
                        "success" => false,
                        "message" => "Supplier not found",
                    ], JsonResponse::HTTP_NOT_FOUND);
            }

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_SUPPLIER,
                description: "View Supplier",
                subjectType: "Supplier",
                subjectId: $supplier_id,
                data: json_encode($supplier->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Get supplier successfully",
                    "data" => $supplier->toResource()
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function updateSupplier(int $supplier_id, UpdateSupplierDTO $updateSupplierDTO): JsonResponse
    {
        $supplier = $this->supplierRepositoryInterface->findOneById($supplier_id);
        if (!$supplier) {
            return response()
                ->json([
                    "success" => false,
                    "message" => "Supplier not found",
                ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->supplierRepositoryInterface->update($supplier, $updateSupplierDTO);

            $image = $updateSupplierDTO->profile_image;

            if (is_null($image)) {
                $supplier->clearMediaCollection("supplier_profile_image");
            }

            if ($image instanceof UploadedFile) {
                $supplier->uploadImage("supplier_profile_image");
            }

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::UPDATE_SUPPLIER,
                description: "Update Supplier",
                subjectType: "Supplier",
                subjectId: $supplier_id,
                data: json_encode($updateSupplierDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Supplier updated successfully",
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteSupplier(int $supplier_id): JsonResponse
    {
        $supplier = $this->supplierRepositoryInterface->findOneById($supplier_id);
        if (!$supplier) {
            return response()
                ->json([
                    "success" => false,
                    "message" => "Supplier not found",
                ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->supplierRepositoryInterface->delete($supplier);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::DELETE_SUPPLIER,
                description: "Delete Supplier",
                subjectType: "Supplier",
                subjectId: $supplier_id,
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Supplier deleted successfully",
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteBulkSupplier(DeleteBulkSupplierDTO $deleteBulkSupplierDTO): JsonResponse
    {
        try {
            $this->supplierRepositoryInterface->bulkDelete($deleteBulkSupplierDTO);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::DELETE_SUPPLIER,
                description: "Delete Supplier",
                subjectType: "Supplier",
                subjectId: json_encode($deleteBulkSupplierDTO),
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Delete bulk supplier successfully",
                ]);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
