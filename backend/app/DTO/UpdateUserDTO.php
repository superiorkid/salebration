<?php

namespace App\DTO;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\References\RouteParameterReference;

class UpdateUserDTO extends Data
{
   public function __construct(
       #[Nullable, StringType, Min(2)]
       public ?string $name = null,

        #[
            Nullable,
            Email,
            Unique(
                table: 'users',
                column: 'email',
                ignore: new RouteParameterReference("user_id"),
            )
        ]
        public ?string $email = null,

        #[Nullable, StringType, Min(6), Confirmed]
        public ?string $password = null,

        #[Nullable, IntegerType, Exists("roles", "id")]
        public ?int $role = null,

        #[Nullable, Date]
        public ?Carbon $email_verified_at = null,

        #[Nullable, StringType]
        public ?string $refresh_token = null
   )
   {
       //
   }
}
