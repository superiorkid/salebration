<?php

namespace App\Interfaces;

use App\DTO\CustomerDTO;
use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Support\Collection;

interface CustomerRepositoryInterface
{
    public function findMany(?string $searchTerm): Collection;
    public function findOneById(int $id): ?Customer;
    public function create(Sale $sale, CustomerDTO $customerDTO): ?Customer;
    public function update(Customer $customer, CustomerDTO $customerDTO): void;
    public function delete(Customer $customer): void;
    public function findExistingCustomer(CustomerDto $customerDTO): ?Customer;
    public function createOrConnectCustomer(Sale $sale, CustomerDTO $customerDTO): Customer;
}
