import { TLogin } from "@/app/(authentication)/enter/login-schema";
import { getQueryClient } from "@/lib/query-client";
import { getSessionAction, loginAction, logOutAction } from "@/servers/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useLoginMutation() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TLogin) => {
      const result = await loginAction(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to login", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Login successful", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: ["session"] });

      router.refresh();
    },
  });

  return { loginMutation: mutate, isPending };
}

export function useSession() {
  const { data: session, isPending } = useQuery({
    queryKey: ["session"],
    queryFn: async () => getSessionAction(),
  });

  return { session, isPending };
}

export function useSignOut() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await logOutAction();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to Log out", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Log out successful", {
        description: data?.message,
      });
      queryClient.clear();

      router.refresh();
    },
  });

  return {
    logoutMutation: mutate,
    isPending,
  };
}
