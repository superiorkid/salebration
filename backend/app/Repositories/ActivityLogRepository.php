<?php

namespace App\Repositories;

use App\DTO\ActivityLogDTO;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ActivityLogRepository implements ActivityLogRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function all(): Collection
    {
        return ActivityLog::query()
            ->with(["user"])
            ->orderBy("created_at", "DESC")
            ->get();
    }

    public function create(ActivityLogDTO $activityLogDto): ActivityLog
    {
        return ActivityLog::query()->create([
            "user_id" => $activityLogDto->userId ?? null,
            "action" => $activityLogDto->action->value,
            "description" => $activityLogDto->description,
            "subject_type" => $activityLogDto->subjectType,
            "subject_id" => $activityLogDto->subjectId,
            "data" => $activityLogDto->data ?? null,
        ]);
    }

    public function pruneActivityLogs(Carbon $cutOffDate): mixed
    {
        return ActivityLog::query()
            ->where('created_at', '<', $cutOffDate)
            ->delete();
    }
}
