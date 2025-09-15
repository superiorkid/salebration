<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class LoginDTO extends Data
{
    #[Required, Email]
    public string $email;

    #[Required, StringType]
    public string $password;
}
