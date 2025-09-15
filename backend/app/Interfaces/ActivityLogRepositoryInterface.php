<?php

namespace App\Interfaces;

use App\DTO\ActivityLogDTO;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Support\Collection;

interface ActivityLogRepositoryInterface
{
    public function all(): Collection;
    public function create(ActivityLogDTO $activityLogDto): ActivityLog;
    public function pruneActivityLogs(Carbon $cutOffDate): mixed;
}
