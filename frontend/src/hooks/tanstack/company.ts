import { getQueryClient } from "@/lib/query-client";
import { companyKeys } from "@/lib/query-keys";
import { getCompany, updateCompnayInformation } from "@/servers/company";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useDetailCompany() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: companyKeys.all,
    queryFn: async () => {
      const company = await getCompany();
      if ("error" in company) {
        throw new Error(company.error);
      }
      return company;
    },
  });

  return { company: data, isPending, isError, error };
}

export function useUpdateCompany() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateCompnayInformation(formData);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Failed to update company", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      toast.success("Update company successfully", {
        description: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
      router.replace("/settings/company");
    },
  });

  return { updateCompanyMutation: mutate, isPending };
}
