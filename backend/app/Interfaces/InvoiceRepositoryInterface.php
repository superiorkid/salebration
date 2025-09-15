<?php

namespace App\Interfaces;

use App\DTO\InvoiceDTO;
use App\Models\Invoice;

interface InvoiceRepositoryInterface
{
    public function findOneById(int $id): ?Invoice;
    public function findOneByInvoiceNumber(string $invoiceNumber): ?Invoice;
    public function create(InvoiceDTO $invoiceDto): Invoice;
}
