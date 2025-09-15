<?php

namespace App\Http\Controllers;

use App\DTO\CreateSaleDTO;
use App\DTO\CustomerDTO;
use App\DTO\RefundDTO;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;

class SaleController extends Controller
{
    protected SaleService $saleService;

    public function __construct(SaleService $saleService) {
        $this->saleService = $saleService;
    }

    public function sales(): JsonResponse
    {
        return $this->saleService->all();
    }

    public function createSale(CreateSaleDTO $createSaleDTO): JsonResponse
    {
        return $this->saleService->createSale($createSaleDTO);
    }

    public function detailSale(string $id): JsonResponse
    {
        return $this->saleService->findOneById($id);
    }

    public function todayKpis(): JsonResponse {
        return $this->saleService->todayKpis();
    }


    public function refundSale(RefundDTO $refundDto, string $sale_id): JsonResponse
    {
        return $this->saleService->refundSale($refundDto, (int) $sale_id);
    }

    public function assignCustomer(string $sale_id, CustomerDTO $customerDTO): JsonResponse
    {
        return $this->saleService->assignCustomer((int) $sale_id, $customerDTO);
    }

}
