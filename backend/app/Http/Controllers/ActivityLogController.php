<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityLogRequest;
use App\Http\Requests\UpdateActivityLogRequest;
use App\Models\ActivityLog;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    protected ActivityLogService $activityLogService;

    public function __construct(
        ActivityLogService $activityLogService
    )
    {
        $this->activityLogService = $activityLogService;
    }

    public function activityLogs(): JsonResponse
    {
        return $this->activityLogService->activityLogs();
    }
}
