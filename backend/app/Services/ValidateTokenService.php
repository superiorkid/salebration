<?php

namespace App\Services;

use App\DTO\ValidateOrderTokenDTO;
use App\Enums\OrderStatusEnum;
use App\Enums\OrderValidationTypeEnum;
use App\Interfaces\PurchaseOrderRepositoryInterface;
use App\Interfaces\ReorderRepositoryInterface;
use App\Traits\TokenHelper;
use Exception;
use Illuminate\Http\JsonResponse;

class ValidateTokenService
{
    use TokenHelper;

    protected PurchaseOrderRepositoryInterface $purchaseOrderRepositoryInterface;
    protected ReorderRepositoryInterface $reorderRepositoryInterface;

    public function __construct(
        PurchaseOrderRepositoryInterface $purchaseOrderRepositoryInterface,
        ReorderRepositoryInterface $reorderRepositoryInterface
    )
    {
        $this->purchaseOrderRepositoryInterface = $purchaseOrderRepositoryInterface;
        $this->reorderRepositoryInterface = $reorderRepositoryInterface;
    }

    public function orderTokenValidation(ValidateOrderTokenDTO $validateOrderTokenDTO): JsonResponse
    {
        try {
            $tokenData = $this->validateOrderToken($validateOrderTokenDTO->token);
            if ($tokenData["order_id"] !== $validateOrderTokenDTO->order_id) {
                return response()->json([
                    "success" => false,
                    "message" => "Token does not match this reorder"
                ], JsonResponse::HTTP_FORBIDDEN);
            }

            if ($validateOrderTokenDTO->type === OrderValidationTypeEnum::REORDER->value) {
                $order = $this->reorderRepositoryInterface->findOneById($tokenData["order_id"]);
            } else {
                $order = $this->purchaseOrderRepositoryInterface->findOneById($tokenData["order_id"]);
            }

            if (empty($order)) {
                return response()->json([
                    "success" => false,
                    "message" => "Order not found"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            if ($order->status !== OrderStatusEnum::PENDING->value) {
                return response()->json([
                    "success" => false,
                    "message" => "The order has already been processed"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                "success" => true,
                "message" => "The order has been processed",
                "data" => [
                    "order_id" => $tokenData["order_id"],
                    "supplier_id" => $tokenData["supplier_id"],
                    "expires_at" => $tokenData["expires_at"],
                    "type" => $tokenData["type"],
                    "order" => $order,
                ]
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
}
