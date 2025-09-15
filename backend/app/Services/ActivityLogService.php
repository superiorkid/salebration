<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\Enums\ActivityLogActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        ActivityLogRepositoryInterface $activityLogRepositoryInterface
    )
    {
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }

    public function activityLogs(): JsonResponse
    {
        try {
            $logs = $this->activityLogRepositoryInterface->all();

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_ACTIVITY_LOG,
                description: "View Activity Logs",
                subjectType: "ActivityLog",
                subjectId: "-",
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Get activity logs successfully",
                    "data" => $logs
                ], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
