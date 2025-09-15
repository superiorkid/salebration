<?php

namespace App\DTO;

use App\Enums\StatusEnum;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\References\RouteParameterReference;
use Symfony\Contracts\Service\Attribute\Required;

class UpdateSupplierDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string  $name,

        #[Required, Email, Unique(
            table: 'suppliers',
            column: 'email',
            ignore: new RouteParameterReference("supplier_id"))
        ]
        public string  $email,

        #[Nullable, StringType]
        public ?string $phone,

        #[Nullable, StringType]
        public ?string $address,

        #[Nullable]
        public mixed   $profile_image,

        #[Required, Enum(StatusEnum::class)]
        public string  $status,
    )
    {
        //
    }
}
