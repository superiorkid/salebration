<?php

namespace App\Http\Controllers;

use App\DTO\LoginDTO;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Log;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function signIn(LoginDTO $loginDTO): JsonResponse
    {
        return $this->authService->login($loginDTO);
    }

    public function refresh(Request $request): JsonResponse
    {
        return $this->authService->refreshToken($request->user(), $request->bearerToken());
    }

    public function logOut(Request $request): JsonResponse
    {
        return $this->authService->logout($request->user());
    }

    public function getSession(Request $request): JsonResponse
    {
        return $this->authService->getSession($request->user());
    }

}
