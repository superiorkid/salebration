import { TValidateOrderToken } from "@/app/(supplier)/supplier/confirmation/validate-order-token-schema";
import validateOrderToken from "@/servers/validate-order-token";
import { useMutation } from "@tanstack/react-query";

export default function useValidateOrderToken() {
  const { mutate, isPending, error, isError, data } = useMutation({
    mutationFn: async (values: TValidateOrderToken) => {
      const result = await validateOrderToken(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
  });

  return {
    validateOrderTokenMutation: mutate,
    isPending,
    error,
    isError,
    data,
  };
}
