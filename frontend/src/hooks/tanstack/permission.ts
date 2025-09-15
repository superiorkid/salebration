import { permissionKeys } from "@/lib/query-keys";
import { getPermissions } from "@/servers/permission";
import { useQuery } from "@tanstack/react-query";

export function usePermissions() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: permissionKeys.all,
    queryFn: async () => {
      const permissions = await getPermissions();
      if ("error" in permissions) {
        throw new Error(permissions.error);
      }
      return permissions;
    },
  });

  return { permissions: data, isPending, isError, error };
}
