<?php

namespace App\Console\Commands;

use App\Interfaces\ActivityLogRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PruneActivityLogsCommand extends Command
{

    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    public function __construct(
        ActivityLogRepositoryInterface $activityLogRepositoryInterface
    )
    {
        parent::__construct();
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'activity-logs:prune
                            {--days=90 : Delete records older than this number of days}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove old activity logs from database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $cutoffDate = Carbon::now()->subDays($days);
        $deletedCount = $this->activityLogRepositoryInterface->pruneActivityLogs($cutoffDate);
        $this->info("Deleted {$deletedCount} activity logs older than {$days} days.");
        return Command::SUCCESS;
    }
}
