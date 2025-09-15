<?php

namespace App\DTO;

use App\Enums\StatusEnum;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class CreateSupplierDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string        $name,

        #[Required, Email]
        public string        $email,

        #[Nullable, StringType]
        public ?string       $phone,

        #[Nullable, StringType]
        public ?string       $address,

        #[Nullable, File]
        public ?UploadedFile $profile_image,

        #[Required, Enum(StatusEnum::class)]
        public string        $status,
    )
    {
        //
    }
}
