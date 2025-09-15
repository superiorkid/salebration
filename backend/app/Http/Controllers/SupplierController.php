<?php

namespace App\Http\Controllers;

use App\DTO\CreateSupplierDTO;
use App\DTO\DeleteBulkSupplierDTO;
use App\DTO\UpdateSupplierDTO;
use App\Services\SupplierService;
use Illuminate\Http\JsonResponse;

class SupplierController extends Controller
{
    protected SupplierService $supplierService;

    public function __construct(SupplierService $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    public function suppliers(): JsonResponse
    {
        return $this->supplierService->suppliers();
    }

    public function createSupplier(CreateSupplierDTO $createSupplierDTO): JsonResponse
    {
        return $this->supplierService->createSupplier($createSupplierDTO);
    }

    public function detailSupplier(int $supplier_id): JsonResponse
    {
        return $this->supplierService->detailSupplier($supplier_id);
    }

    public function updateSupplier(int $supplier_id, UpdateSupplierDTO $updateSupplierDTO): JsonResponse
    {
        return $this->supplierService->updateSupplier($supplier_id, $updateSupplierDTO);
    }

    public function deleteSupplier(int $supplier_id): JsonResponse
    {
        return $this->supplierService->deleteSupplier($supplier_id);
    }

    public function deleteBulkSupplier(DeleteBulkSupplierDTO $deleteBulkSupplierDTO): JsonResponse
    {
        return $this->supplierService->deleteBulkSupplier($deleteBulkSupplierDTO);
    }
}
