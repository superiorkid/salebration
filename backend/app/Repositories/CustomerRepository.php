<?php

namespace App\Repositories;

use App\DTO\CustomerDTO;
use App\Interfaces\CustomerRepositoryInterface;
use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class CustomerRepository implements CustomerRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create(Sale $sale, CustomerDTO $customerDTO): ?Customer
    {
        $customer = Customer::query()
            ->create([
                "name" => $customerDTO->name,
                "company_name" => $customerDTO->companyName ?? null,
                "email" => $customerDTO->email ?? null,
                "phone" => $customerDTO->phone ?? null,
                "address" => $customerDTO->address ?? null,
                "city" => $customerDTO->city ?? null,
                "postal_code" => $customerDTO->postalCode ?? null,
                "notes" => $customerDTO->notes ?? null,
            ]);

        $sale->customer()->associate($customer);
        $sale->save();
        return $customer;
    }

    public function findOneById(int $id): ?Customer
    {
        return Customer::query()->find($id);
    }

    public function findMany(?string $searchTerm = null): Collection
    {
        return Customer::query()
            ->with(["sales"])
            ->when($searchTerm, function ($query) use ($searchTerm) {
                $query->where(function($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(name) LIKE ?', ['%'.strtolower($searchTerm).'%'])
                        ->orWhereRaw('LOWER(email) LIKE ?', ['%'.strtolower($searchTerm).'%'])
                        ->orWhereRaw('LOWER(phone) LIKE ?', ['%'.strtolower($searchTerm).'%']);
                });
            })
            ->orderBy("created_at", "desc")
            ->get();
    }

    public function delete(Customer $customer): void
    {
        $customer->delete();
    }

    public function update(Customer $customer, CustomerDTO $customerDTO): void
    {
        $customer->update([
            "name" => $customerDTO->name,
            "company_name" => $customerDTO->companyName ?? null,
            "email" => $customerDTO->email ?? null,
            "phone" => $customerDTO->phone ?? null,
            "address" => $customerDTO->address ?? null,
            "city" => $customerDTO->city ?? null,
            "postal_code" => $customerDTO->postalCode ?? null,
            "notes" => $customerDTO->notes ?? null,
        ]);
    }

    public function findExistingCustomer(CustomerDTO $customerDTO): ?Customer
    {
        return Customer::query()
            ->where('name', $customerDTO->name)
            ->where(function($query) use ($customerDTO) {
                $query->whereNotNull('email')
                    ->where('email', $customerDTO->email)
                    ->orWhereNotNull('phone')
                    ->where('phone', $customerDTO->phone);
            })
            ->first();
    }

    public function createOrConnectCustomer(Sale $sale, CustomerDTO $customerDTO): Customer
    {
        $existingCustomer = $this->findExistingCustomer($customerDTO);

        if ($existingCustomer) {
            $sale->customer()->associate($existingCustomer);
            $sale->save();
            return $existingCustomer;
        }

        return $this->create($sale, $customerDTO);
    }
}
