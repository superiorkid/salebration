<?php

namespace App\Traits;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

trait TokenHelper
{
    public function generateOrderToken(
        int $orderId,
        int $supplierId,
        string $type = 'purchase_order',
        int $expiryDays = 3
    ): string {
        $validTypes = ['purchase_order', 'reorder'];

        if (!in_array($type, $validTypes)) {
            throw new \InvalidArgumentException("Invalid order type. Must be either 'purchase_order' or 'reorder'");
        }

        $tokenData = [
            "order_id" => $orderId,
            "supplier_id" => $supplierId,
            "type" => $type,
            "expires_at" => now()->addDays($expiryDays)->timestamp,
            "action" => "order_verification"
        ];

        return Crypt::encrypt($tokenData);
    }

    public function validateOrderToken(string $token): array
    {
        try {
            $decrypted = Crypt::decrypt($token);

            $requiredFields = [
                "order_id",
                "supplier_id",
                "type",
                "expires_at",
                "action"
            ];

            foreach ($requiredFields as $field) {
                if (empty($decrypted[$field])) {
                    throw new \InvalidArgumentException("Invalid order token - missing field: {$field}");
                }
            }

            if (!in_array($decrypted['type'], ['purchase_order', 'reorder'])) {
                throw new \InvalidArgumentException("Invalid order type in token");
            }

            if (now()->timestamp > $decrypted['expires_at']) {
                throw new \RuntimeException('Token has expired');
            }

            return $decrypted;
        } catch (DecryptException $e) {
            throw new \RuntimeException("Invalid token");
        }
    }

    public function generateReorderToken(int $reorderId, int $supplierId, int $expiryDays = 3): string
    {
        return $this->generateOrderToken($reorderId, $supplierId, 'reorder', $expiryDays);
    }

    public function generatePurchaseOrderToken(int $poId, int $supplierId, int $expiryDays = 3): string
    {
        return $this->generateOrderToken($poId, $supplierId, 'purchase_order', $expiryDays);
    }
}
