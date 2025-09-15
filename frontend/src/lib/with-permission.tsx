import { PermissionsEnum } from "@/enums/permissions";
import { getSessionAction } from "@/servers/auth";
import { TUser } from "@/types/user";
import { redirect } from "next/navigation";
import { JSX } from "react";
import { hasPermission } from "./utils";

export function withPermission<P>(
  Component: (props: P) => Promise<JSX.Element> | JSX.Element,
  requiredPermission: PermissionsEnum,
) {
  const Wrapper = async (props: P): Promise<JSX.Element> => {
    const session = await getSessionAction();
    const allowed = hasPermission(session?.data as TUser, requiredPermission);

    if (!allowed) {
      redirect("/unauthorized");
    }

    return await Component(props);
  };

  return Wrapper;
}
