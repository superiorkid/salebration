<?php

namespace App\Http\Controllers;

use App\DTO\CustomerDTO;
use App\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected CustomerService $customerService;

    public function __construct(
        CustomerService $customerService
    )
    {
        $this->customerService = $customerService;
    }

    public function customers(Request $request): JsonResponse
    {
        $searchName = $request->query('search');
        return $this->customerService->customers($searchName);
    }

    public function editCustomer(string $customer_id, CustomerDto $customerDto): JsonResponse
    {
        return $this->customerService->editCustomer($customer_id, $customerDto);
    }

    public function deleteCustomer(string $customer_id): JsonResponse
    {
        return $this->customerService->deleteCustomer($customer_id);
    }

    public function detailCustomer(string $customer_id): JsonResponse
    {
        return $this->customerService->detailCustomer($customer_id);
    }
}
