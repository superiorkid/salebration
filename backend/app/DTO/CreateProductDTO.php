<?php

namespace App\DTO;

use App\Enums\StatusEnum;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Numeric;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class CreateProductDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string       $name,

        #[Required, StringType]
        public string       $sku,

        #[Nullable, StringType]
        public ?string      $description,

        #[Required, Numeric]
        public int          $base_price,

        #[Required, File]
        public UploadedFile $image,

        #[Required, Enum(StatusEnum::class)]
        public string       $status,

        #[Required, IntegerType, Exists("product_categories", "id")]
        public int          $category_id,

        #[Required, IntegerType, Exists("suppliers", "id")]
        public int          $supplier_id,

        #[DataCollectionOf(CreateProductVariantDTO::class), Min(1)]
        public Collection   $variants
    )
    {
        //
    }
}
