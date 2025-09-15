<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class DeleteBulkCategoryDTO extends Data
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
