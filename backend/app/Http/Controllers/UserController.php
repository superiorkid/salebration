<?php

namespace App\Http\Controllers;

use App\DTO\CreateUserDTO;
use App\DTO\UpdatePasswordDTO;
use App\DTO\UpdateUserDTO;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function users(): JsonResponse
    {
        return $this->userService->all();
    }

    public function createUser(CreateUserDTO $createUserDTO): JsonResponse
    {
        return $this->userService->create($createUserDTO);
    }

public function detailUser(string $user_id): JsonResponse
    {
        return $this->userService->detail((int) $user_id);
    }

    public function updateUser(string $user_id, UpdateUserDTO $updateUserDTO): JsonResponse
    {
        return $this->userService->updateUser((int) $user_id, $updateUserDTO);
    }

    public function deleteUser(string $user_id): JsonResponse
    {
        return $this->userService->deleteUser((int) $user_id);
    }

    public function updatePassword(string $user_id, UpdatePasswordDTO $updatePasswordDTO): JsonResponse
    {
        return $this->userService->updatePassword((int) $user_id, $updatePasswordDTO);
    }
}
