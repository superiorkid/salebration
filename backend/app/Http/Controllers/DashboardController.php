<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(
        DashboardService $dashboardService
    )
    {
        $this->dashboardService = $dashboardService;
    }

    public function dashboardMetrics(): JsonResponse
    {
        return $this->dashboardService->dashboardMetrics();
    }
}
