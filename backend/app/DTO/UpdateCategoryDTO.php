<?php

namespace App\DTO;

use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Support\Validation\References\RouteParameterReference;

class UpdateCategoryDTO extends CreateCategoryDTO
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[
            Required,
            StringType,
            Unique(
                table: 'product_categories',
                column: 'name',
                ignore: new RouteParameterReference("category_id"),
            )
        ]
        string  $name,

        ?string $description,
        ?int    $parentId,
    )
    {
        parent::__construct($name, $description, $parentId);
    }
}
