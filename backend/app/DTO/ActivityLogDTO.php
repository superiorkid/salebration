<?php

namespace App\DTO;

use App\Enums\ActivityLogActionEnum;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Json;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class ActivityLogDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Nullable, IntegerType]
        public int $userId,

        #[Required, Enum(ActivityLogActionEnum::class)]
        public ActivityLogActionEnum $action,

        #[Required, StringType]
        public string $description,

        #[Required, StringType]
        public string $subjectType,

        #[Required, StringType]
        public string $subjectId,

        #[Required, StringType]
        public mixed $data
    )
    {
        //
    }
}
