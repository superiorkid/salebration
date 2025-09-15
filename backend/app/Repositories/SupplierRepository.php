<?php

namespace App\Repositories;

use App\DTO\CreateSupplierDTO;
use App\DTO\DeleteBulkSupplierDTO;
use App\DTO\UpdateSupplierDTO;
use App\Interfaces\SupplierRepositoryInterface;
use App\Models\Supplier;
use Illuminate\Support\Collection;
use Throwable;

class SupplierRepository implements SupplierRepositoryInterface
{
    /**
     * @throws Throwable
     */
    public function findOneByName(string $name): ?Supplier
    {
        return Supplier::query()
            ->where('name', $name)
            ->first();
    }

    /**
     * @throws Throwable
     */
    public function findOneById(int $id): ?Supplier
    {
        return Supplier::query()
            ->find($id);
    }

    /**
     * @throws Throwable
     */
    public function findOneByEmail(string $email): ?Supplier
    {
        return Supplier::query()
            ->where('email', $email)
            ->first();
    }

    /**
     * @throws Throwable
     */
    public function findAll(): Collection
    {
        return Supplier::query()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(CreateSupplierDTO $createSupplierDTO): Supplier
    {
        return Supplier::query()
            ->create([
                "name" => $createSupplierDTO->name,
                "email" => $createSupplierDTO->email,
                "phone" => $createSupplierDTO->phone ?? null,
                "address" => $createSupplierDTO->address ?? null,
                "status" => $createSupplierDTO->status,
            ]);
    }

    public function update(Supplier $supplier, UpdateSupplierDTO $updateSupplierDTO): Supplier
    {
        return tap($supplier)->update([
            "name" => $updateSupplierDTO->name,
            "email" => $updateSupplierDTO->email,
            "phone" => $updateSupplierDTO->phone ?? null,
            "address" => $updateSupplierDTO->address ?? null,
            "status" => $updateSupplierDTO->status,
        ]);
    }

    public function bulkDelete(DeleteBulkSupplierDTO $deleteBulkSupplierDTO): void
    {
        Supplier::query()
            ->whereIn('id', $deleteBulkSupplierDTO->ids)
            ->delete();
    }

    public function delete(Supplier $supplier): void
    {
        $supplier->delete();
    }

    public function findByIds(array $ids): ?Collection
    {
        return Supplier::query()
            ->whereIn('id', $ids)
            ->get();
    }
}
