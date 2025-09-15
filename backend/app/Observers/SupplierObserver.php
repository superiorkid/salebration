<?php

namespace App\Observers;

use App\Models\Supplier;

class SupplierObserver
{
    public function deleted(Supplier $supplier): void
    {
        if ($supplier->hasMedia("supplier_profile_image")) {
            $supplier->clearMediaCollection("supplier_profile_image");
        }
    }

    public function forceDeleted(Supplier $supplier): void
    {
        if ($supplier->hasMedia("supplier_profile_image")) {
            $supplier->clearMediaCollection("supplier_profile_image");
        }
    }
}
