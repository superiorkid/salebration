<?php

namespace App\Services;

use App\DTO\ActivityLogDTO;
use App\DTO\LoginDTO;
use App\DTO\Response\GetTokenResponse;
use App\DTO\UpdateUserDTO;
use App\Enums\ActivityLogActionEnum;
use App\Enums\TokenAbilityEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Log;

class AuthService
{
    protected UserRepositoryInterface $userRepositoryInterface;
    protected ActivityLogRepositoryInterface $activityLogRepositoryInterface;

    protected int $acExpiration;
    protected int $rtExpiration;

    /**
     * Create a new class instance.
     */
    public function __construct(
        UserRepositoryInterface $userRepositoryInterface,
        ActivityLogRepositoryInterface $activityLogRepositoryInterface,
    )
    {
        $this->activityLogRepositoryInterface = $activityLogRepositoryInterface;
        $this->userRepositoryInterface = $userRepositoryInterface;
        $this->acExpiration = config('sanctum.ac_expiration');
        $this->rtExpiration = config('sanctum.rt_expiration');
    }

    public function login(LoginDTO $loginDTO): JsonResponse
    {
        $user = $this->userRepositoryInterface->findOneByEmail($loginDTO->email);

        $activityLogData = new ActivityLogDTO(
            userId: $user->id,
            action: ActivityLogActionEnum::LOGIN,
            description: "Login",
            subjectType: "User",
            subjectId: (string) $user->id,
            data: json_encode($loginDTO->toArray()),
        );

        $this->activityLogRepositoryInterface->create($activityLogData);

        if (!$user || !Hash::check($loginDTO->password, $user->password)) {
            return response()
                ->json([
                    "success" => false,
                    "message" => "Email or Password are incorrect."
                ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            $tokens = $this->getTokens($user);

            $hashedRefreshToken = Hash::make($tokens->refresh_token);

            $updateUserData = new UpdateUserDTO(
                refresh_token: $hashedRefreshToken
            );
            $this->userRepositoryInterface->update($user, $updateUserData);

            return response()
                ->json([
                    "success" => true,
                    "message" => "User logged in successfully.",
                    "data" => $tokens
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function getTokens(User $user): GetTokenResponse
    {
        $accessToken = $user
            ->createToken(
                'access_token',
                [TokenAbilityEnum::ACCESS_API->value],
                Carbon::now()->addMinutes($this->acExpiration));
        $refreshToken = $user
            ->createToken(
                'refresh_token',
                [TokenAbilityEnum::ISSUE_ACCESS_TOKEN->value],
                Carbon::now()->addMinutes($this->rtExpiration));
        return new GetTokenResponse($accessToken->plainTextToken, $refreshToken->plainTextToken);
    }

    public function logout(User $user): JsonResponse
    {
        try {
            $updateUserData = new UpdateUserDTO(
                refresh_token: null
            );
            $this->userRepositoryInterface->update($user, $updateUserData);
            $user->tokens()->delete();

            $activityLogData = new ActivityLogDTO(
                userId: Auth::id(),
                action: ActivityLogActionEnum::LOGOUT,
                description: "Log Out",
                subjectType: "User",
                subjectId: $user->id,
                data: "-"
            );
            $this->activityLogRepositoryInterface->create($activityLogData);

            return response()
                ->json(["success" => true, "message" => "Logged out successfully"], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json(["success" => false, "message" => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

    public function refreshToken(User $user, string $bearerToken): JsonResponse
    {
        if (!Hash::check($bearerToken, $user->refresh_token)) {
            return response()
                ->json(["success" => false, "message" => "Invalid token."], JSONResponse::HTTP_UNAUTHORIZED);
        }

        try {
            $accessToken = $user
                ->createToken(
                    'access_token',
                    [TokenAbilityEnum::ACCESS_API->value],
                    Carbon::now()->addMinutes($this->acExpiration)
                )->plainTextToken;
            return response()
                ->json([
                    "success" => true,
                    "message" => "New token generated successfully",
                    "data" => ["access_token" => $accessToken]
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(["success" => false, "message" => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getSession(User $user): JsonResponse
    {
        try {
            $user->load("roles.permissions");

            return response()
                ->json([
                    "success" => true,
                    "message" => "Get session successfully.",
                    "data" => $user
                ], JsonResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()
                ->json([
                    "success" => false,
                    "message" => $e->getMessage()
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
