<?php

namespace App\Interfaces;

use App\DTO\CreateUserDTO;
use App\DTO\UpdatePasswordDTO;
use App\DTO\UpdateUserDTO;
use App\Models\User;

interface UserRepositoryInterface
{
    public function findOneByEmail(string $email);
    public function findOneById(int $id);
    public function findOneByName(string $name);
    public function findMany();
    public function create(CreateUserDTO $createUserDTO);
    public function update(User $user, UpdateUserDTO $updateUserDTO);
    public function delete(User $user);

    /**
     * @param list<string> $ids
     */
    public function deleteMany(array $ids);
    public function updatePassword(User $user, UpdatePasswordDTO $updatePasswordDTO): void;

}
