import { TRoleSchema } from "@/app/(app)/settings/roles/role-schema";
import { getQueryClient } from "@/lib/query-client";
import { roleKeys } from "@/lib/query-keys";
import {
  createRole,
  deleteRole,
  detailRole,
  getRoles,
  updateRole,
} from "@/servers/role";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useRoles() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: roleKeys.all,
    queryFn: async () => {
      const roles = await getRoles();
      if ("error" in roles) {
        throw new Error(roles.error);
      }
      return roles;
    },
  });

  return { roles: data, isPending, isError, error };
}

export function useCreateRole() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TRoleSchema) => {
      const result = await createRole(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to create role", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Create role successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      router.replace("/settings/roles");
    },
  });

  return { createRoleMutation: mutate, isPending };
}

export function useDetailRole(roleId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: roleKeys.detail(roleId),
    queryFn: async () => {
      const role = await detailRole(roleId);
      if ("error" in role) {
        throw new Error(role.error);
      }
      return role;
    },
    enabled: !!roleId,
  });

  return { role: data, isPending, isError, error };
}

interface DeleteProps {
  onSuccess?: () => void;
}

export function useDeleteRole(props: DeleteProps) {
  const { onSuccess } = props;

  const { mutate, isPending } = useMutation({
    mutationFn: async (roleId: number) => {
      const result = await deleteRole(roleId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to delete role", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Delete role successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      onSuccess?.();
    },
  });

  return { deleteRoleMutation: mutate, isPending };
}

export function useUpdateRole() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: { roleId: number; values: TRoleSchema }) => {
      const { roleId, values } = params;
      const result = await updateRole({ roleId, values });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update role", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update role successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      router.replace("/settings/roles");
    },
  });

  return { updateRoleMutation: mutate, isPending };
}
