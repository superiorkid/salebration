<?php

namespace App\Services;

use App\Models\PurchaseOrder;
use App\Models\Reorder;

class DocumentNumberService
{
    public function generateReorderNumber(): string
    {
        return $this->generateNumber("RO");
    }

    public function generatePurchaseOrderNumber(): string
    {
        return $this->generateNumber("PO");
    }

    protected function generateNumber(string $prefix): string
    {
        $dateSegment = now()->format('Ymd');
        $lastNumber = $this->getLastSequenceNumber($prefix, $dateSegment);
        return sprintf(
            '%s-%s-%04d',
            $prefix,
            $dateSegment,
            $lastNumber + 1
        );
    }

    protected function getLastSequenceNumber(string $prefix, string $date): int
    {
        $lastRO = Reorder::query()
            ->where("purchase_order_number", "LIKE", "RO-{$date}-%")
            ->orderBy("purchase_order_number", "DESC")
            ->first();

        $lastPO = PurchaseOrder::query()
            ->where("purchase_order_number", "LIKE", "PO-{$date}-%")
            ->orderBy("purchase_order_number", "DESC")
            ->first();

        $roNumber = $lastRO ? (int) substr($lastRO->purchase_order_number, -4) : 0;
        $poNumber = $lastPO ? (int) substr($lastPO->purchase_order_number, -4) : 0;

        return max($roNumber, $poNumber);
    }
}
