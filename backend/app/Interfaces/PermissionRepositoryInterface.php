<?php

namespace App\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface PermissionRepositoryInterface
{
    public function findMany(): Collection;
}
