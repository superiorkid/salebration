<?php

namespace App\Interfaces;

use App\DTO\CreateSupplierDTO;
use App\DTO\DeleteBulkSupplierDTO;
use App\DTO\UpdateSupplierDTO;
use App\Models\Supplier;
use Illuminate\Support\Collection;

interface SupplierRepositoryInterface
{
    public function findOneByEmail(string $email): ?Supplier;


    public function findOneById(int $id): ?Supplier;

    public function findOneByName(string $name): ?Supplier;

    public function findByIds(array $ids): ?Collection;

    public function findAll(): Collection;

    public function create(CreateSupplierDTO $createSupplierDTO): Supplier;

    public function update(Supplier $supplier, UpdateSupplierDTO $updateSupplierDTO): Supplier;

    public function delete(Supplier $supplier): void;

    public function bulkDelete(DeleteBulkSupplierDTO $deleteBulkSupplierDTO): void;
}
