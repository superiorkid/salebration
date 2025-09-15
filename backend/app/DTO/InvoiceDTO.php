<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class InvoiceDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, IntegerType]
        public int $saleId,

        #[Required, StringType]
        public string $invoiceNumber,
    )
    {
        //
    }
}
