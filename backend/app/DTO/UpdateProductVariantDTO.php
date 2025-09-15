<?php

namespace App\DTO;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Numeric;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Symfony\Contracts\Service\Attribute\Required;

class UpdateProductVariantDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[Required, StringType]
        public string  $attribute,

        #[Required, StringType]
        public string  $value,

        #[Required, StringType]
        public string  $sku_suffix,

        public ?string $barcode,

        #[Nullable]
        public mixed   $image,

        #[Required, Numeric, Min(0)]
        public float   $additional_price,

        #[Required, Numeric, Min(0)]
        public float         $selling_price,

        #[Required, Numeric, Min(0)]
        public int     $quantity,

        #[Required, Numeric, Min(0)]
        public int     $min_stock_level,

        #[Required, Numeric, Exists("products", "id")]
        public int     $product_id
    )
    {
        //
    }

    public static function rules(ValidationContext $context): array
    {
        $productId = request()->route("product_id");
        return [
            "barcode" => [
                "nullable",
                "string",
                Rule::unique("product_variants", "barcode")->ignore($productId, "product_id")
            ],
        ];
    }
}
