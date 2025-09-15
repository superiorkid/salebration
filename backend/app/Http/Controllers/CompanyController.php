<?php

namespace App\Http\Controllers;

use App\DTO\CompanyDTO;
use App\Services\CompanyService;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    protected CompanyService $companyService;

    public function __construct(
        CompanyService $companyService
    )
    {
        $this->companyService = $companyService;
    }

    public function companyInformation(): JsonResponse
    {
        return $this->companyService->companyInformation();
    }

    public function setCompanyInformation(CompanyDTO $companyDTO): JsonResponse
    {
        return $this->companyService->editCompanyInformation($companyDTO);
    }
}
