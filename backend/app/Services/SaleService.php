<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\DTO\CreateSaleDTO;
use App\DTO\CustomerDTO;
use App\DTO\InvoiceDTO;
use App\DTO\RefundDTO;
use App\DTO\StockHistoryDTO;
use App\Enums\ActivityLogActionEnum;
use App\Enums\PaymentMethodEnum;
use App\Enums\SaleStatusEnum;
use App\Enums\StockHistoryTypeEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\CustomerRepositoryInterface;
use App\Interfaces\InvoiceRepositoryInterface;
use App\Interfaces\PaymentRepositoryInterface;
use App\Interfaces\ProductVariantRepositoryInterface;
use App\Interfaces\RefundRepositoryInterface;
use App\Interfaces\SaleItemRepositoryInterface;
use App\Interfaces\SaleRepositoryInterface;
use App\Interfaces\StockHistoryRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleService
{
    protected SaleRepositoryInterface $saleRepositoryInterface;
    protected SaleItemRepositoryInterface $saleItemRepositoryInterface;
    protected PaymentRepositoryInterface $paymentRepositoryInterface;
    protected RefundRepositoryInterface $refundRepositoryInterface;
    protected ProductVariantRepositoryInterface $productVariantRepositoryInterface;
    protected InvoiceRepositoryInterface $invoiceRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;
    protected CustomerRepositoryInterface $customerRepositoryInterface;
    protected StockHistoryRepositoryInterface $stockHistoryRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        SaleRepositoryInterface $saleRepositoryInterface,
        SaleItemRepositoryInterface $saleItemRepositoryInterface,
        PaymentRepositoryInterface $paymentRepositoryInterface,
        RefundRepositoryInterface $refundRepositoryInterface,
        ProductVariantRepositoryInterface $productVariantRepositoryInterface,
        InvoiceRepositoryInterface $invoiceRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface,
        CustomerRepositoryInterface $customerRepositoryInterface,
        StockHistoryRepositoryInterface $stockHistoryRepositoryInterface
    )
    {
        $this->saleRepositoryInterface = $saleRepositoryInterface;
        $this->saleItemRepositoryInterface = $saleItemRepositoryInterface;
        $this->paymentRepositoryInterface = $paymentRepositoryInterface;
        $this->refundRepositoryInterface = $refundRepositoryInterface;
        $this->productVariantRepositoryInterface = $productVariantRepositoryInterface;
        $this->invoiceRepositoryInterface = $invoiceRepositoryInterface;
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
        $this->customerRepositoryInterface = $customerRepositoryInterface;
        $this->stockHistoryRepositoryInterface = $stockHistoryRepositoryInterface;
    }


    public function all(): JsonResponse
    {
        try {
            $sales = $this->saleRepositoryInterface->findMany();

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_TRANSACTION,
                description: "View Transactions",
                subjectType: "Sale",
                subjectId: '-',
                data: '-'
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json([
                "success" => true,
                "message" => "Get Sales Successfully",
                "data" => $sales,
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function findOneById(string $id): JsonResponse{
        try {
            $sale = $this->saleRepositoryInterface->findOneById($id);

            if (empty($sale)) {
                return response()->json([
                    "success" => false,
                    "message" => "Sale not found"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_TRANSACTION,
                description: "View Transaction",
                subjectType: "Sale",
                subjectId: $id,
                data: json_encode($sale->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json([
                "success" => true,
                "message" => "Get Sale Successfully",
                "data" => $sale,
            ], JsonResponse::HTTP_OK);
        }  catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function createSale(CreateSaleDTO $createSaleDTO): JsonResponse
    {
        foreach ($createSaleDTO->items as $item) {
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

           $sale = $this->saleRepositoryInterface->create($createSaleDTO);
           $this->saleItemRepositoryInterface->createItemsForSale($createSaleDTO->items, $sale->id);

            foreach ($sale->items as $item) {
                $variant = $this->productVariantRepositoryInterface->findOneById($item->product_variant_id);
                if ($variant){
                    $beforeQuantity = $variant->quantity;
                    $variant->decrement('quantity', $item->quantity);
                    $afterQuantity = $beforeQuantity - $item->quantity;

                    $stockHistoryDto = new StockHistoryDTO(
                        product_variant_id: $variant->id,
                        type: StockHistoryTypeEnum::SALE->value,
                        quantity_before: $beforeQuantity,
                        quantity_after: $afterQuantity,
                        quantity_change: -$item->quantity,
                        notes: 'Stock deducted due to sale'
                    );
                    $this->stockHistoryRepositoryInterface->create($stockHistoryDto, $sale);
                }
            }

           $this->paymentRepositoryInterface->create($createSaleDTO->payment, $sale->id);

            $invoiceNumber = 'INV-' . now()->format("Ymd") . "-" . str_pad($sale->id, 4, 0, STR_PAD_LEFT);
            $invoicePayload = InvoiceDTO::from([
                "saleId" => $sale->id,
                "invoiceNumber" => $invoiceNumber,
            ]);
            $this->invoiceRepositoryInterface->create($invoicePayload);

            if (filled($createSaleDTO->customer)) {
                $this->customerRepositoryInterface->createOrConnectCustomer($sale, $createSaleDTO->customer);
            }

            // TODO(optional): print the invoice to print hardware

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::CREATE_TRANSACTION,
                description: "Create Transaction",
                subjectType: "Sale",
                subjectId: $sale->id,
                data: json_encode($createSaleDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);


            DB::commit();
            return response()->json([
                "success" => true,
                "message" => "Create Sale Successfully",
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

    public function todayKpis(): JsonResponse
    {
        try {
            $salesToday = $this->saleRepositoryInterface->findAllTodaySales();
            $totalSales = $salesToday->count();
            $refundCount = $salesToday->where("status", SaleStatusEnum::REFUNDED->value)->count();

            $itemsSold = $this->saleItemRepositoryInterface->getTotalItemsSoldToday();

            $totalRevenue = $this->paymentRepositoryInterface->getTotalRevenueToday();
            $paymentTotals = $this->paymentRepositoryInterface->getTodayRevenueByPaymentMethod();

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_DASHBOARD,
                description: "View Dashboard",
                subjectType: "Sale",
                subjectId: "-",
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json([
                'success' => true,
                'message' => "Today's KPIs fetched successfully.",
                'data' => [
                    'total_sales' => $totalSales,
                    'total_revenue' => $totalRevenue,
                    'total_items_sold' => $itemsSold,
                    'cash_total' => $paymentTotals[PaymentMethodEnum::CASH->value] ?? 0,
                    'qris_total' => $paymentTotals[PaymentMethodEnum::QRIS->value] ?? 0,
                    'card_total' => $paymentTotals[PaymentMethodEnum::CARD->value] ?? 0,
                    'refund_count' => $refundCount,
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

    public function refundSale(RefundDTO $refundDto, int $saleId): JsonResponse
    {
        $sale = $this->saleRepositoryInterface->findOneById($saleId);
        if (is_null($sale)) {
            return response()->json([
                "success" => false,
                "message" => "Sale not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($sale->status === SaleStatusEnum::REFUNDED->value) {
            return response()->json([
                "success" => false,
                "message" => "Sale already refunded"
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            DB::beginTransaction();

            $sale->update([
                "status" => SaleStatusEnum::REFUNDED->value,
            ]);

            // restore stock
            foreach ($sale->items as $item) {
                $productVariant = $item->productVariant;

                $beforeQuantity = $productVariant->quantity;
                $productVariant->increment('quantity', $item->quantity);
                $afterQuantity = $productVariant->quantity;

                $stockHistoryDto = new StockHistoryDTO(
                    product_variant_id: $productVariant->id,
                    type: StockHistoryTypeEnum::REFUND->value,
                    quantity_before: $beforeQuantity,
                    quantity_after: $afterQuantity,
                    quantity_change: $item->quantity,
                    notes: 'Refunded transaction'
                );
                $this->stockHistoryRepositoryInterface->create($stockHistoryDto, $sale);
            }

            $this->refundRepositoryInterface->create($saleId, $refundDto->reason);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::REFUND_TRANSACTION,
                description: "Refund Transaction",
                subjectType: "Sale",
                subjectId: $saleId,
                data: json_encode($refundDto->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Refund Successfully",
            ], JsonResponse::HTTP_OK);
        } catch  (Exception $e) {
            DB::rollback();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function assignCustomer(int $saleId, CustomerDTO $customerDTO): JsonResponse
    {
        $sale = $this->saleRepositoryInterface->findOneById($saleId);
        if (empty($sale)) {
            return response()->json([
                "success" => false,
                "message" => "Sale not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($sale->customer) {
            return response()->json([
                "success" => false,
                "message" => "Sale already assigned to customer"
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            DB::beginTransaction();
            $this->customerRepositoryInterface->createOrConnectCustomer($sale, $customerDTO);
            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "Customer assigned to sale"
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollback();
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
