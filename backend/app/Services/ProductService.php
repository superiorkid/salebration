<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\DTO\CreateProductDTO;
use App\DTO\CreateProductVariantDTO;
use App\DTO\UpdateProductDTO;
use App\Enums\ActivityLogActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\ProductRepositoryInterface;
use App\Interfaces\ProductVariantRepositoryInterface;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProductService
{
    protected ProductRepositoryInterface $productRepositoryInterface;
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        ProductRepositoryInterface        $productRepositoryInterface,
        ProductVariantRepositoryInterface $productVariantRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface
    )
    {
        $this->productRepositoryInterface = $productRepositoryInterface;
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }

    public function products(): JsonResponse
    {
        try {
            $products = $this->productRepositoryInterface->findMany();

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_PRODUCT,
                description: "View Products",
                subjectType: "Product",
                subjectId: "-",
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "Get products successfully",
                    "data" => $products->toResourceCollection()
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createProduct(CreateProductDTO $createProductDTO): JsonResponse
    {
        $name = $this->productRepositoryInterface->findOnebyName($createProductDTO->name);
        if ($name) {
            return response()
                ->json([
                    "success" => false,
                    "message" => "Product already exists",
                ], JsonResponse::HTTP_CONFLICT);
        }

        try {
            DB::beginTransaction();

            $newProduct = $this->productRepositoryInterface->create($createProductDTO);
            $newProduct->uploadImage($createProductDTO->image, "product_image");

            foreach ($createProductDTO->variants as $variantDTO) {
                $newProductVariant = $this->productVariantRepositoryInterface->create($newProduct, $variantDTO);

                if ($variantDTO->image) {
                    $newProductVariant->uploadImage($variantDTO->image, "product_variant_image");
                }
            }


            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::CREATE_PRODUCT,
                description: "Create Product",
                subjectType: "Product",
                subjectId: $newProduct->id,
                data: json_encode($createProductDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            DB::commit();

            return response()
                ->json([
                    "success" => true,
                    "message" => "Create product successfully",
                ], JsonResponse::HTTP_CREATED);
        } catch (Exception $e) {
            DB::rollBack();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detailProduct(int $product_id): JsonResponse
    {
        try {
            $product = $this->productRepositoryInterface->findOnebyId($product_id);
            if (!$product) {
                return response()
                    ->json([
                        "success" => false,
                        "message" => "Product not found",
                    ], JsonResponse::HTTP_NOT_FOUND);
            }

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_PRODUCT,
                description: "View Product",
                subjectType: "Product",
                subjectId: $product_id,
                data: json_encode($product->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);


            return response()
                ->json([
                    "success" => true,
                    "message" => "Get product successfully",
                    "data" => $product->toResource(),
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function updateProduct(int $product_id, UpdateProductDTO $updateProductDTO): JsonResponse
    {
        $product = $this->productRepositoryInterface->findOneById($product_id);
        if (!$product) {
            return response()->json([
                "success" => false,
                "message" => "Product not found",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($updateProductDTO->name !== $product->name) {
            $existingProductByName = $this->productRepositoryInterface->findOneByName($updateProductDTO->name);

            if ($existingProductByName) {
                return response()->json([
                    "success" => false,
                    "message" => "Another product with the same name already exists",
                ], JsonResponse::HTTP_CONFLICT);
            }
        }

        try {
            DB::beginTransaction();
            $productImage = $updateProductDTO->image;

            if (is_null($productImage)) {
                $product->clearMediaCollection("product_image");
            }

            if ($productImage instanceof UploadedFile) {
                $product->uploadImage($productImage, "product_image");
            }

            $this->productRepositoryInterface->update($product, $updateProductDTO);
            if ($updateProductDTO->image) {
                $product->uploadImage($updateProductDTO->image, "product_image");
            }

            // delete previous product variants
            $this->productVariantRepositoryInterface->deleteManyByProductId($product->id);

            foreach ($updateProductDTO->variants as $variantDTO) {
                $variantMerge = [...$variantDTO->toArray(), "product_id" => $product->id];
                $variantWithProductId = CreateProductVariantDTO::from($variantMerge);
                $newVariant = $this->productVariantRepositoryInterface->create($product, $variantWithProductId);

                $productVariantImage = $variantDTO->image;

                if (is_null($productVariantImage)) {
                    $newVariant->clearMediaCollection("product_variant_image");
                }

                if ($productVariantImage instanceof UploadedFile) {
                    $newVariant->uploadImage($variantDTO->image, "product_variant_image");
                }
            }

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::UPDATE_PRODUCT,
                description: "Update Products",
                subjectType: "Product",
                subjectId: $product_id,
                data: json_encode($updateProductDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Update product successfully",
            ], JsonResponse::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => "Product not found",
            ], JsonResponse::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteProduct(int $product_id): JsonResponse
    {
        $product = $this->productRepositoryInterface->findOneById($product_id);
        if (!$product) {
            return response()->json([
                "success" => false,
                "message" => "Product not found",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->productRepositoryInterface->delete($product);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::DELETE_PRODUCT,
                description: "Delete Products",
                subjectType: "Product",
                subjectId: $product_id,
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json([
                "success" => true,
                "message" => "Delete product successfully",
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
