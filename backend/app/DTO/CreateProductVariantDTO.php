<?php

namespace App\DTO;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Numeric;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Symfony\Contracts\Service\Attribute\Required;

class CreateProductVariantDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string        $attribute,

        #[Required, StringType]
        public string        $value,

        #[Required, StringType]
        public string        $sku_suffix,

        #[Nullable, StringType, Unique("product_variants", "barcode")]
        public ?string       $barcode,

        #[Nullable, File]
        public ?UploadedFile $image = null,

        #[Required, Numeric, Min(0)]
        public float         $additional_price,

        #[Required, Numeric, Min(0)]
        public float         $selling_price,

        #[Required, Numeric, Min(0)]
        public int           $quantity,

        #[Required, Numeric, Min(0)]
        public int           $min_stock_level,

        #[Nullable, Numeric]
        public ?int          $product_id,
    )
    {
        //
    }
}
