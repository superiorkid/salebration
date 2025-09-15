<?php

namespace App\Interfaces;

use App\DTO\CompanyDTO;
use App\Models\Company;

interface CompanyRepositoryInterface
{
    public function getCompany(): Company;
    public function editCompany(Company $company, CompanyDTO $companyDTO): void;
}
