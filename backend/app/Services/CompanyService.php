<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\DTO\CompanyDTO;
use App\Enums\ActivityLogActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\CompanyRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CompanyService
{
    protected CompanyRepositoryInterface $companyRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        CompanyRepositoryInterface $companyRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface,
    )
    {
        $this->companyRepositoryInterface = $companyRepositoryInterface;
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }

    public function companyInformation(): JsonResponse
    {
        try {
            $company = $this->companyRepositoryInterface->getCompany();

            $activityLogData = new ActivityLogDTO(
                userId: auth()->id(),
                action: ActivityLogActionEnum::VIEW_COMPANY,
                description: "Viewed Company Information",
                subjectType: "Company",
                subjectId: (string) $company->id,
                data: json_encode([
                    "company_id" => $company->id,
                    "company_name" => $company->name,
                    "accessed_at" => now()->toDateTimeString(),
                ])
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json([
                "success" => true,
                "message" => "Company Information",
                "data" => $company
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function editCompanyInformation(CompanyDTO $companyDTO): JsonResponse
    {
        $company = $this->companyRepositoryInterface->getCompany();

        try {
            DB::beginTransaction();
            $this->companyRepositoryInterface->editCompany($company, $companyDTO);

            if (filled($companyDTO->logo)) {
                if ($companyDTO->logo instanceof UploadedFile) {
                    $company->uploadImage($companyDTO->logo, 'company_logo');
                }
            } else {
                $company->clearMediaCollection('company_logo');
            }

            $activityLogData = new ActivityLogDTO(
                userId: auth()->id(),
                action: ActivityLogActionEnum::EDIT_COMPANY,
                description: "Updated Company Information",
                subjectType: "Company",
                subjectId: (string) $company->id,
                data: json_encode([
                    "data" => $companyDTO->toArray(),
                    'changed_at' => now()->toDateTimeString(),
                ])
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            DB::commit();
            return response()->json([
                "success" => true,
                "message" => "Company Information Updated",
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
