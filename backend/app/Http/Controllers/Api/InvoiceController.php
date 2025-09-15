<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvoiceController extends Controller
{
    protected InvoiceService $invoiceService;

    public function __construct(
        InvoiceService $invoiceService
    )
    {
        $this->invoiceService = $invoiceService;
    }

    public function invoice(Request $request): JsonResponse{
        $invoiceNumber = $request->query('invoice_number');
        return $this->invoiceService->getInvoiceDetail($invoiceNumber);
    }

    public function download(string $invoice_id): JsonResponse|Response
    {
        return $this->invoiceService->generateInvoicePdf($invoice_id);
    }

    public function preview(string $invoice_id): JsonResponse|Response {
        return $this->invoiceService->generateInvoicePdf($invoice_id, "stream");
    }
}
