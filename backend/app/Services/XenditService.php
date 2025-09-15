<?php

namespace App\Services;

use App\DTO\CreateSaleDTO;
use App\DTO\InvoiceDTO;
use App\DTO\PaymentDTO;
use App\DTO\StockHistoryDTO;
use App\DTO\XenditDTO;
use App\Enums\PaymentMethodEnum;
use App\Enums\SaleStatusEnum;
use App\Enums\StockHistoryTypeEnum;
use App\Interfaces\InvoiceRepositoryInterface;
use App\Interfaces\PaymentRepositoryInterface;
use App\Interfaces\ProductVariantRepositoryInterface;
use App\Interfaces\SaleItemRepositoryInterface;
use App\Interfaces\SaleRepositoryInterface;
use App\Interfaces\StockHistoryRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\InvoiceStatus;

class XenditService
{
    protected InvoiceApi $xenditInvoiceApi;
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;
    protected SaleRepositoryInterface $saleRepositoryInterface;
    protected InvoiceRepositoryInterface $invoiceRepositoryInterface;
    protected PaymentRepositoryInterface $paymentRepositoryInterface;
    protected StockHistoryRepositoryInterface $stockHistoryRepositoryInterface;
    protected SaleItemRepositoryInterface $saleItemRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        ProductVariantRepositoryInterface $productVariantRepositoryInterface,
        SaleRepositoryInterface $saleRepositoryInterface,
        InvoiceRepositoryInterface $invoiceRepositoryInterface,
        PaymentRepositoryInterface $paymentRepositoryInterface,
        StockHistoryRepositoryInterface $stockHistoryRepositoryInterface,
        SaleItemRepositoryInterface $saleItemRepositoryInterface
    )
    {
        Configuration::setXenditKey(config('services.xendit.secret_key'));
        $this->xenditInvoiceApi = new InvoiceApi();
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
        $this->saleRepositoryInterface = $saleRepositoryInterface;
        $this->invoiceRepositoryInterface = $invoiceRepositoryInterface;
        $this->paymentRepositoryInterface = $paymentRepositoryInterface;
        $this->stockHistoryRepositoryInterface = $stockHistoryRepositoryInterface;
        $this->saleItemRepositoryInterface = $saleItemRepositoryInterface;
    }

    public function createInvoice(XenditDTO $createInvoiceDTO): JsonResponse
    {
        foreach ($createInvoiceDTO->items as $item) {
            $variant = $this->productVariantRepositoryInterface->findOneById($item->productVariantId);
            if (empty($variant)) {
                return response()->json([
                    "success" => false,
                    "message" => "Product variant not found (ID: {$item->productVariantId})"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            if ($variant->quantity < $item->quantity) {
                return response()->json([
                    "success" => false,
                    "message" => "Insufficient stock for variant '{$variant->attribute} - {$variant->value}'. Only {$variant->quantity} left."
                ], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

        try {
            DB::beginTransaction();

            $sale = $this->saleRepositoryInterface->create(new CreateSaleDTO(
                total: $createInvoiceDTO->total,
                paid: 0,
                change: 0,
                items: $createInvoiceDTO->items,
                payment: $createInvoiceDTO->payment,
                customer: $createInvoiceDTO->customer
            ), SaleStatusEnum::PENDING);


            $orderItems = [];
            foreach ($createInvoiceDTO->items as $item) {
                $variant = $this->productVariantRepositoryInterface->findOneById($item->productVariantId);

                $orderItems[] = [
                    'name' => $variant->product->name . " ({$variant->attribute}: {$variant->value})",
                    'quantity' => $item->quantity,
                    'price' => $variant->selling_price,
                ];
            }

            $this->saleItemRepositoryInterface->createItemsForSale($createInvoiceDTO->items, $sale->id);

            // build xendit invoice
            $externalId = 'INV-' . now()->format("Ymd") . "-" . str_pad($sale->id, 4, 0, STR_PAD_LEFT);
            $params = [
                'external_id' => $externalId,
                'amount' => $createInvoiceDTO->total,
                'description' => 'Payment for POS order #' . $sale->id,
                'invoice_duration' => 300, // 5 minutes
                'currency' => 'IDR',
                'success_redirect_url' => config('app.frontend_url') . '/sales/pos',
                'failure_redirect_url' => config('app.frontend_url') . '/payment-failed?reason=failed&ref=' . $externalId,
                'items' => $orderItems,
                'payment_methods' => ['QRIS']
            ];

            if ($createInvoiceDTO->customer) {
                $params["payer_email"] = $createInvoiceDTO->customer->email;
            }

            $invoice = $this->xenditInvoiceApi->createInvoice(new CreateInvoiceRequest($params));

            $this->invoiceRepositoryInterface->create(new InvoiceDTO(
                saleId: $sale->id,
                invoiceNumber: $externalId,
            ));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Invoice created',
                "data" => $invoice
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function webhook(array $payload): JsonResponse
    {
        $status = $payload['status'] ?? null;
        $externalId = $payload['external_id'] ?? null;

        if ($status !== InvoiceStatus::PAID) {
            Log::debug('PAYMENT ALREADY PAID');
            return response()->json([
                "message" => "Ignored"
            ], JsonResponse::HTTP_OK);
        }

        try {
            DB::beginTransaction();

            $invoice = $this->invoiceRepositoryInterface->findOneByInvoiceNumber($externalId);
            if (empty($invoice)) {
                return response()->json([
                    "success"=> false,
                    "message" => "Invoice not found"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            $sale = $this->saleRepositoryInterface->findOneById($invoice->sale_id);
            if (empty($sale)) {
                return response()->json([
                    "success"=> false,
                    "message" => "Sale not found"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            // skip if already paid
            if ($sale->status === SaleStatusEnum::PAID->value) {
                return response()->json([
                    "success"=> false,
                    "message" => "Sale already paid"
                ], JsonResponse::HTTP_BAD_REQUEST);
            }

            // mark sale as paid
            $sale->update([
                "status" => SaleStatusEnum::PAID->value,
                "paid" => $payload["paid_amount"],
            ]);

            $paymentData = new PaymentDTO(
                method: PaymentMethodEnum::QRIS,
                amount: $payload['amount'],
            );
            $this->paymentRepositoryInterface->create($paymentData, $sale->id);

            // stock update
            foreach ($sale->items as $item) {
                $variant = $this->productVariantRepositoryInterface->findOneById($item->product_variant_id);
                if ($variant) {
                    $before = $variant->quantity;
                    $variant->decrement('quantity', $item->quantity);
                    $after = $before - $item->quantity;

                    $stockHistory = new StockHistoryDTO(
                        product_variant_id: $variant->id,
                        type: StockHistoryTypeEnum::SALE->value,
                        quantity_before: $before,
                        quantity_after: $after,
                        quantity_change: -$item->quantity,
                        notes: 'Stock deducted via QRIS webhook'
                    );

                    $this->stockHistoryRepositoryInterface->create($stockHistory, $sale);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Sale marked as paid via webhook.',
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

}
