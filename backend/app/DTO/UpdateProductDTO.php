<?php

namespace App\DTO;

use App\Enums\StatusEnum;
use Illuminate\Support\Collection;
use Log;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Numeric;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\References\RouteParameterReference;

class UpdateProductDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        #[
            Required,
            StringType,
            Unique(
                table: "products",
                column: "name",
                ignore: new RouteParameterReference("product_id")
            )
        ]
        public string     $name,

        #[
            Required,
            StringType,
            Unique(
                table: "products",
                column: "sku",
                ignore: new RouteParameterReference("product_id")
            )
        ]
        public string     $sku,

        #[Nullable, StringType]
        public ?string    $description,

        #[Required, Numeric]
        public int        $base_price,

        #[Nullable]
        public mixed      $image,

        #[Required, Enum(StatusEnum::class)]
        public string     $status,

        #[Required, IntegerType, Exists("product_categories", "id")]
        public int        $category_id,

        #[Required, IntegerType, Exists("suppliers", "id")]
        public int        $supplier_id,

        #[DataCollectionOf(UpdateProductVariantDTO::class), Min(1)]
        public Collection $variants
    )
    {
        //
    }


//    public static function rules(ValidationContext $context): array
//    {
//        $productId = request()->route('product_id');
//
//        return [
//            'name' => ['required', 'string', 'max:255', Rule::unique('products', 'name')->ignore($productId)],
//            'sku' => ['required', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($productId)],
//            'description' => ['nullable', 'string'],
//            'base_price' => ['required', 'numeric', 'min:0'],
//            'image' => ['nullable'],
//            'status' => ['required', Rule::in(array_column(StatusEnum::cases(), 'value'))],
//            'category_id' => ['required', 'integer', 'exists:product_categories,id'],
//            'supplier_id' => ['required', 'integer', 'exists:suppliers,id'],
//
//            'variants' => ['required', "array"],
//            'variants.*.attribute' => ['required', 'string'],
//            'variants.*.value' => ['required', 'string'],
//            'variants.*.sku_suffix' => ['required', 'string'],
//            'variants.*.barcode' => [
//                'nullable',
//                'string',
//                Rule::unique("product_variants", "barcode")->ignore($productId, 'product_id'),
//            ],
//            'variants.*.image' => ['nullable'],
//            'variants.*.additional_price' => ['required', 'numeric', 'min:0'],
//            'variants.*.quantity' => ['required', 'integer', 'min:0'],
//            'variants.*.min_stock_level' => ['required', 'integer', 'min:0'],
//        ];
//    }
}
