<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Sometimes;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class CreateCategoryDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string  $name,

        #[Sometimes, Nullable, StringType]
        public ?string $description,

        #[Sometimes, Nullable, Exists('product_categories', 'id')]
        public ?int    $parentId
    )
    {
    }
}
