<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\DTO\CreateUserDTO;
use App\DTO\UpdatePasswordDTO;
use App\DTO\UpdateUserDTO;
use App\Enums\ActivityLogActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\UserRepositoryInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserService
{
    protected UserRepositoryInterface $userRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    /**
     * Create a new class instance.
     */
    public function __construct(
        UserRepositoryInterface $userRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface,
    )
    {
        $this->userRepositoryInterface = $userRepositoryInterface;
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
    }

    public function all(): JsonResponse {
        try {
            $users = $this->userRepositoryInterface->findMany();

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::VIEW_USER,
                description: "View Users",
                subjectType: "User",
                subjectId: "-",
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()->json([
                "success" => true,
                "message" => "get users successfully",
                "data" => $users
            ], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function create(CreateUserDTO $createUserDTO): JsonResponse
    {
        $user = $this->userRepositoryInterface->findOneByEmail($createUserDTO->email);
        if ($user) {
            return response()->json([
                "success" => false,
                "message" => "user already exists"
            ], JsonResponse::HTTP_CONFLICT);
        }

        try {
            DB::beginTransaction();
            $newUser = $this->userRepositoryInterface->create($createUserDTO);

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::CREATE_USER,
                description: "Create Users",
                subjectType: "User",
                subjectId: $newUser->id,
                data: json_encode($createUserDTO->toArray())
            );
            $this->activityLogRepositoryInterface->create($activityLogData);
            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "create user successfully"
            ], JsonResponse::HTTP_CREATED);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detail(int $user_id): JsonResponse {
        $user = $this->userRepositoryInterface->findOneById($user_id);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "user not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $activityLogData = new ActivityLogDTO(
            userId: Auth::id(),
            action: ActivityLogActionEnum::VIEW_USER,
            description: "View User",
            subjectType: "User",
            subjectId: $user_id,
            data: json_encode($user->toarray())
        );
        $this->activityLogRepositoryInterface->create($activityLogData);

        return response()->json([
            "success" => true,
            "message" => "get user successfully",
            "data" => $user
        ], JsonResponse::HTTP_OK);
    }

    public function updateUser(int $user_id, UpdateUserDTO $updateUserDTO): JsonResponse
    {
        $user = $this->userRepositoryInterface->findOneById($user_id);
        if (empty($user)) {
            return response()->json([
                "success" => false,
                "message" => "user not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        // check if email is being changed to one that already exists
        if ($updateUserDTO->email !== $user->email) {
            $existingUser = $this->userRepositoryInterface->findOneByEmail($updateUserDTO->email);
            if ($existingUser) {
                return response()->json([
                    "success" => false,
                    "message" => "user already exists"
                ], JsonResponse::HTTP_CONFLICT);
            }
        }

        try {
            DB::beginTransaction();

            $originalData = $user->toarray();
            $this->userRepositoryInterface->update($user, $updateUserDTO);


            // Log the activity
            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::UPDATE_USER,
                description: "Updated User {$user->email}",
                subjectType: "User",
                subjectId: $user->id,
                data: json_encode([
                    'original' => $originalData,
                    'changes' => $updateUserDTO->toArray()
                ])
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            DB::commit();

            return response()->json([
                "success" => true,
                "message" => "update user successfully"
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteUser(int $user_id): JsonResponse
    {
        $user = $this->userRepositoryInterface->findOneById($user_id);
        if (empty($user)) {
            return response()->json([
                "success" => false,
                "message" => "user not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->userRepositoryInterface->delete($user);
            return response()->json([
                "success" => true,
                "message" => "delete user successfully"
            ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function updatePassword(int $user_id, UpdatePasswordDTO $updatePasswordDTO): JsonResponse{
        $user = $this->userRepositoryInterface->findOneById($user_id);
        if (empty($user)) {
            return response()->json([
                "success" => false,
                "message" => "user not found"
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            DB::beginTransaction();
            $this->userRepositoryInterface->updatePassword($user, $updatePasswordDTO);

            // TODO: add activity logs

            DB::commit();
            return response()->json([
                "success" => true,
                "message" => "update password successfully"
            ], JsonResponse::HTTP_OK);
        }catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
