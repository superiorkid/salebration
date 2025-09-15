<?php

namespace App\Http\Controllers;

use App\DTO\XenditDTO;
use App\Services\XenditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditController extends Controller
{
    protected XenditService $xenditService;

    public function __construct(
        XenditService $xenditService,
    )
    {
        $this->xenditService = $xenditService;
    }

    public function createInvoice(XenditDTO $createInvoiceDTO): JsonResponse
    {
        return $this->xenditService->createInvoice($createInvoiceDTO);
    }

    public function createWebhookInvoicePaid(Request $request): JsonResponse
    {
        $payload = $request->all();

        // verify xendit signature headers
        $providedSignature = $request->header("X-CALLBACK_TOKEN");
        $expectedSignature = config("services.xendit.webhook_secret");

        if ($providedSignature !== $expectedSignature) {
            Log::debug("INVALID SIGNATURE");
            return response()->json([
                'success' => false,
                'message' => 'Invalid signature'
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $this->xenditService->webhook($payload);
    }
}
