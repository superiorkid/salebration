<?php

namespace App\Repositories;

use App\DTO\InvoiceDTO;
use App\Interfaces\InvoiceRepositoryInterface;
use App\Models\Invoice;

class InvoiceRepository implements InvoiceRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create(InvoiceDTO $invoiceDto): Invoice
    {
        return Invoice::query()
            ->create([
                "sale_id" => $invoiceDto->saleId,
                "number" => $invoiceDto->invoiceNumber,
                "issued_at" => now()
            ]);
    }

    public function findOneById(int $id): ?Invoice
    {
        return Invoice::query()
            ->with(["sale.operator", "sale.items.productVariant.product", "sale.payments", "sale.customer"])
            ->find($id);
    }

    public function findOneByInvoiceNumber(string $invoiceNumber): ?Invoice
    {
        return Invoice::query()
            ->with(["sale.operator", "sale.items.productVariant.product", "sale.payments", "sale.customer"])
            ->where("number", "=", $invoiceNumber)
            ->first();
    }

}
