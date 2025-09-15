<?php

namespace App\Repositories;

use App\DTO\CompanyDTO;
use App\Interfaces\CompanyRepositoryInterface;
use App\Models\Company;

class CompanyRepository implements CompanyRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getCompany(): Company
    {
        return Company::query()
            ->with("media")
            ->first();
    }

    public function editCompany(Company $company, CompanyDTO $companyDTO): void
    {
        $company->update([
            'name' => $companyDTO->name,
            'display_name' => $companyDTO->display_name,
            'phone' => $companyDTO->phone,
            'email' => $companyDTO->email,
            'address' => $companyDTO->address,
            'website' => $companyDTO->website ?? null,
            'owner_name' => $companyDTO->owner_name ?? null,
        ]);
    }
}
