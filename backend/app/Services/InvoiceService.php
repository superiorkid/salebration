<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\Enums\ActivityLogActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\InvoiceRepositoryInterface;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class InvoiceService
{
    protected InvoiceRepositoryInterface $invoiceRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        InvoiceRepositoryInterface $invoiceRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface,
    )
    {
        $this->invoiceRepositoryInterface = $invoiceRepositoryInterface;
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }

    public function getInvoiceDetail(string $invoiceNumber): JsonResponse
    {
        if (empty($invoiceNumber)) {
            return response()->json([
                "success" => false,
                "message" => "Invoice Number is required"
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $invoice = $this->invoiceRepositoryInterface->findOneByInvoiceNumber($invoiceNumber);
            if (empty($invoice)) {
                return response()->json([
                    "success" => false,
                    "message" => "Invoice not found"
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_INVOICE,
                description: "View Invoice",
                subjectType: "Invoice",
                subjectId: $invoice->id,
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);


            return response()->json([
               "success" => true,
                "message" => "get invoice successfully",
                "data" => $invoice
            ]);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }



    public function generateInvoicePdf(string $invoice_id, string $type = "download"): Response|JsonResponse
    {
        $invoice = $this->invoiceRepositoryInterface->findOneById((int) $invoice_id);
        if (empty($invoice)) {
            return response()->json([
                "success" => false,
                "message" => "Invoice not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $filename = "invoice-{$invoice->number}-{$invoice->created_at->format('Ymd')}.pdf";
        $pdf = Pdf::loadView('pdf', ["invoice" => $invoice])
            ->setPaper('a4', 'portrait')
            ->setOption([
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'debugKeepTemp' => true,
                'dpi' => 96,
                'enable_remote' => true
            ]);

//        $headers = [
//            'Access-Control-Allow-Origin' => '*',
//            'Access-Control-Expose-Headers' => 'Content-Disposition',
//            'Content-Type' => 'application/pdf',
//            'Content-Disposition' => ($type === "stream" ? 'inline' : 'attachment') . '; filename="' . $filename . '"'
//        ];

        if ($type == "stream") {
            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::PREVIEW_INVOICE,
                description: "Preview Invoice",
                subjectType: "Invoice",
                subjectId: $invoice_id,
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return $pdf->stream($filename)
                ->header('Content-Type', 'application/pdf')
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Expose-Headers', 'Content-Disposition')
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
        }


        $activityLogData = new ActivityLogDTO(
            userId: Auth::id(),
            action: ActivityLogActionEnum::DOWNLOAD_INVOICE,
            description: "Download Invoice",
            subjectType: "Invoice",
            subjectId: $invoice_id,
            data: "-"
        );
        $this->activityLogRepositoryInterface->create($activityLogData);

        return $pdf->download($filename)
            ->header('Content-Type', 'application/pdf')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Expose-Headers', 'Content-Disposition')
            ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }


}
