<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\DTO\CustomerDTO;
use App\Enums\ActivityLogActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\CustomerRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    protected CustomerRepositoryInterface $customerRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        CustomerRepositoryInterface $customerRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface
    )
    {
        $this->customerRepositoryInterface = $customerRepositoryInterface;
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }

    public function customers(?string $searchTerm = null): JsonResponse
    {
        try {
            $customers = $this->customerRepositoryInterface->findMany($searchTerm);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_CUSTOMER,
                description: "Viewed customer list" . ($searchTerm ? " with search term: '$searchTerm'" : ""),
                subjectType: "Customer",
                subjectId: '-',
                data: json_encode([
                    "search_term" => $searchTerm,
                    "result_count" => $customers->count(),
                    "accessed_at" => now()->toDateTimeString(),
                ]),
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Customers retrieved successfully",
                    "data" => $customers
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function editCustomer(int $customer_id, CustomerDto $customerDto): JsonResponse
    {
        $customer = $this->customerRepositoryInterface->findOneById($customer_id);
        if (empty($customer)) {
            return response()
                ->json([
                    "success" => false,
                    "message" => "Customer not found"
                ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            DB::beginTransaction();

            $this->customerRepositoryInterface->update($customer, $customerDto);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::UPDATE_CUSTOMER,
                description: "Update Customer",
                subjectType: "Customer",
                subjectId: $customer->id,
                data: json_encode($customerDto->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            DB::commit();
            return response()->json([
                "success" => true,
                "message" => "Customer updated successfully",
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

    public function deleteCustomer(int $customer_id): JsonResponse
    {
        $customer = $this->customerRepositoryInterface->findOneById($customer_id);
        if (empty($customer)) {
            return response()
                ->json([
                    "success" => false,
                    "message" => "Customer not found"
                ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            DB::beginTransaction();
            $this->customerRepositoryInterface->delete($customer);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::DELETE_CUSTOMER,
                description: "Delete Customer",
                subjectType: "Customer",
                subjectId: $customer->id,
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            DB::commit();
            return response()->json([
                "success" => true,
                "message" => "Customer deleted successfully",
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

    public function detailCustomer(string $customer_id): JsonResponse
    {
        try {
            $customer = $this->customerRepositoryInterface->findOneById($customer_id);
            if (empty($customer)) {
                return response()
                    ->json([
                        "success" => false,
                        "message" => "Customer not found"
                    ], JsonResponse::HTTP_NOT_FOUND);
            }

            return response()
                ->json([
                    "success" => true,
                    "message" => "Customer retrieved successfully",
                    "data" => $customer
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e){
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
