import {
  TUpdatePasswordSchema,
  TUserSchema,
} from "@/app/(app)/settings/users/user-schema";
import { getQueryClient } from "@/lib/query-client";
import { userKeys } from "@/lib/query-keys";
import {
  createUser,
  deleteUser,
  detailUser,
  getUsers,
  updateUser,
  updateUserPassword,
} from "@/servers/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useUsers() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const users = await getUsers();
      if ("error" in users) {
        throw new Error(users.error);
      }
      return users;
    },
  });

  return {
    users: data,
    isPending,
    error,
    isError,
  };
}

export function useCreateUser() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TUserSchema) => {
      const result = await createUser(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create user", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create user successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      router.replace("/settings/users");
    },
  });

  return { createUserMutation: mutate, isPending };
}

export function useDetailUser(userId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: async () => {
      const user = await detailUser(userId);
      if ("error" in user) {
        throw new Error(user.error);
      }
      return user;
    },
    enabled: !!userId,
  });

  return { user: data, isPending, isError, error };
}

export function useUpdateUser() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: {
      userId: number;
      values: Pick<TUserSchema, "email" | "name" | "role">;
    }) => {
      const { userId, values } = params;
      const result = await updateUser({ userId, values });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update user", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update user successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  return { updateUserMutation: mutate, isPending };
}

interface DeleteProps {
  onSuccess?: () => void;
}

export function useDeleteUser(props?: DeleteProps) {
  const { onSuccess } = props || {};

  const { mutate, isPending } = useMutation({
    mutationFn: async (userId: number) => {
      const result = await deleteUser(userId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete user", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete user successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      onSuccess?.();
    },
  });

  return { deleteUserMutation: mutate, isPending };
}

interface UpdatePasswordProps {
  onSuccess?: () => void;
}

export function useUpdatePasswordUser({ onSuccess }: UpdatePasswordProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: {
      userId: number;
      values: TUpdatePasswordSchema;
    }) => {
      const { userId, values } = params;
      const result = await updateUserPassword({ userId, values });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update user password", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update user password successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      onSuccess?.();
    },
  });

  return { updateUserPasswordMutation: mutate, isPending };
}
