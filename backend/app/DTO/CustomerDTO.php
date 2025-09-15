<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class CustomerDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string $name,

        #[Nullable, StringType]
        public ?string $companyName,

        #[Nullable, StringType, RequiredWithout("phone")]
        public ?string $email,

        #[Nullable, StringType, RequiredWithout("email")]
        public ?string $phone,

        #[Nullable, StringType]
        public ?string $address,

        #[Nullable, StringType]
        public ?string $city,

        #[Nullable, StringType]
        public ?string $postalCode,

        #[Nullable, StringType]
        public ?string $notes,
    )
    {
        //
    }
}
