<?php

namespace App\Http\Controllers;

use App\DTO\CancelReorderDTO;
use App\DTO\OrderAcceptedDTO;
use App\DTO\OrderRejectedDTO;
use App\DTO\ReorderDTO;
use App\DTO\ValidateReorderTokenDTO;
use App\Services\ReorderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReorderController extends Controller
{
    protected ReorderService $reorderService;

    public function __construct(
        ReorderService $reorderService
    )
    {
        $this->reorderService = $reorderService;
    }

    public function reorders(): JsonResponse
    {
        return $this->reorderService->findAll();
    }

    public function createReorder(ReorderDTO $reorderDTO): JsonResponse
    {
        return $this->reorderService->createReorder($reorderDTO);
    }

    public function detailReorder(string $reorder_id): JsonResponse
    {
        return $this->reorderService->findOneById((int) $reorder_id);
    }

    public function deleteReorder(string $reorder_id): JsonResponse
    {
        return $this->reorderService->deleteReorder((int) $reorder_id);
    }

    public function markAsReceive(string $reorder_id): JsonResponse
    {
        return $this->reorderService->markAsReceive((int) $reorder_id);
    }

    public function markAsCancel(string $reorder_id, CancelReorderDTO $cancelReorderDTO): JsonResponse
    {
        return $this->reorderService->markAsCancel((int) $reorder_id, $cancelReorderDTO);
    }

    public function markAsAccept(
        Request $request,
        OrderAcceptedDTO $orderAcceptedDTO,
        string $reorder_id
    ): JsonResponse
    {
        $token = $request->query("token");
        return $this->reorderService->markAsAccept((int) $reorder_id, $token, $orderAcceptedDTO);
    }

    public function markAsReject(
        Request $request,
        OrderRejectedDTO $orderRejectedDTO,
        string $reorder_id
    ): JsonResponse
    {
        $token = $request->query("token");
        return $this->reorderService->markAsReject((int) $reorder_id, $token, $orderRejectedDTO);
    }

    public function validateReorderToken(ValidateReorderTokenDTO $validateReorderTokenDTO): JsonResponse
    {
        return $this->reorderService->reorderTokenValidation($validateReorderTokenDTO);
    }
}
