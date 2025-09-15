<?php

namespace App\DTO;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class PurchaseOrderDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, IntegerType, Exists("suppliers","id")]
        public int $supplier_id,

        #[Required, WithCast(DateTimeInterfaceCast::class, format: ['Y-m-d H:i:s.v', 'Y-m-d\TH:i:s.v\Z'], type: Carbon::class)]
        public Carbon $expected_at,

        #[Required, StringType]
        public string $notes,

        #[DataCollectionOf(PurchaseOrderItemDTO::class), Min(1)]
        public Collection $items,
    )
    {
        //
    }
}
