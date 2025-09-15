<?php

namespace App\DTO;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class CreateExpensesDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string $title,

        #[Nullable, StringType]
        public ?string $description = null,

        #[Required, IntegerType, Min(0)]
        public int $amount,

        #[Required, WithCast(DateTimeInterfaceCast::class, format: ['Y-m-d H:i:s.v', 'Y-m-d\TH:i:s.v\Z'], type: Carbon::class)]
        public Carbon $paid_at,

        #[Required, IntegerType]
        public int $category_id,

        #[Nullable, ArrayType]
        public ?array $images = null
    )
    {
        //
    }
}
