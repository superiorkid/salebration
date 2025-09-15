import { useEffect, useMemo, useState } from "react";
import { useSession } from "./tanstack/auth";

function useUserPermissions() {
  const { isPending, session } = useSession();
  const user = session?.data;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const permissions = useMemo(
    () =>
      isClient
        ? user?.roles?.flatMap((role) =>
            role.permissions.map((permission) => permission.name),
          ) || []
        : [],
    [user, isClient],
  );

  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  return { isPending, user, permissionSet, isClient };
}

export function usePermission(permission: string): boolean {
  const { isPending, permissionSet, user, isClient } = useUserPermissions();
  if (!isClient || isPending || !user) {
    return false;
  }
  return permissionSet.has(permission);
}
