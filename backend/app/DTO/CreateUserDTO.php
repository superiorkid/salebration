<?php

namespace App\DTO;


use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class CreateUserDTO extends Data
{
    #[Required, StringType, Min(1)]
    public string $name;

    #[Required, Email]
    public string $email;

    #[Required, StringType, Min(6), Confirmed]
    public string $password;

    #[Required, IntegerType, Exists("roles", "id")]
    public int $role;
}
