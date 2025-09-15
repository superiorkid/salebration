<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class CompanyDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string $name,

        #[Required, StringType]
        public string $email,

        #[Required, StringType]
        public string $phone,

        #[Required, StringType]
        public string $address,

        #[Required, StringType]
        public string $display_name,

        #[Nullable, StringType]
        public ?string $website = null,

        #[Nullable, StringType]
        public ?string $owner_name = null,

        #[Nullable]
        public mixed $logo = null,
    )
    {
        //
    }
}
