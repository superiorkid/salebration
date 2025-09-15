<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Symfony\Contracts\Service\Attribute\Required;

class DeleteBulkSupplierDTO
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required]
        #[ArrayType]
        /** @var int[] */
        public array $ids,
    )
    {
        //
    }

    public static function rules(): array
    {
        return [
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ];
    }
}
