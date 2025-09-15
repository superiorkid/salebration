<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Schedule::command("activity-logs:prune", [
    '--days' => config('logging.activity.prune_days')
])
    ->daily()
    ->onSuccess(function () {
        Log::info('Activity log pruning completed successfully');
    })->onFailure(function () {
        Log::error('Activity log pruning failed');
    });

