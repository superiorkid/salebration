<?php

namespace App\Http\Controllers;

use App\DTO\ValidateOrderTokenDTO;
use App\Services\ValidateTokenService;
use Illuminate\Http\JsonResponse;

class ValidateTokenController extends Controller
{

    protected ValidateTokenService $validateTokenService;

    public function __construct(
        ValidateTokenService $validateTokenService
    )
    {
        $this->validateTokenService = $validateTokenService;
    }

    public function validateOrderToken(ValidateOrderTokenDTO $validateOrderTokenDTO): JsonResponse
    {
        return $this->validateTokenService->orderTokenValidation($validateOrderTokenDTO);
    }
}
