<?php

namespace App\DTO\Response;

use Spatie\LaravelData\Data;

class GetTokenResponse extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public string $access_token,
        public string $refresh_token,
    )
    {
        //
    }
}
