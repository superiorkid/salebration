import { TCustomer } from "@/app/(app)/sales/customer-schema";
import { TRefund } from "@/app/(app)/sales/transactions/refund-schema";
import { getQueryClient } from "@/lib/query-client";
import {
  customerKeys,
  invoiceKeys,
  productKeys,
  reportKeys,
  stockHistoryKeys,
  transactionKeys,
} from "@/lib/query-keys";
import {
  assignCustomerToSale,
  checkout,
  detailTransaction,
  getTodayKpis,
  getTransations,
  processPayment,
  refund,
} from "@/servers/sale";
import { TProcessPayment } from "@/types/process-payment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useProcessPayment({
  onPaymentComplete,
}: {
  onPaymentComplete: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: TProcessPayment) => {
      const result = await processPayment(payload);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Payment Failed", {
        description:
          errorMessage || "Could not complete the payment. Please try again.",
      });
    },
    onSuccess: (data) => {
      toast.success("Payment Successful", {
        description: data?.message || "Transaction completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: stockHistoryKeys.all });
      queryClient.invalidateQueries({ queryKey: reportKeys.sales });
      onPaymentComplete();
    },
  });

  return { processTransactionMutaton: mutate, isPending };
}

export function useCheckout() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (
      payload: Pick<
        TProcessPayment,
        "total" | "items" | "payment" | "customer"
      >,
    ) => {
      const result = await checkout(payload);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Payment Failed", {
        description:
          errorMessage || "Could not complete the payment. Please try again.",
      });
    },
    onSuccess: (data) => {
      if (data.data?.invoice_url) {
        toast.success("Redirect...", {
          description: "Redirect to checkout page",
        });

        queryClient.invalidateQueries({ queryKey: transactionKeys.all });
        queryClient.invalidateQueries({ queryKey: productKeys.all });
        queryClient.invalidateQueries({ queryKey: customerKeys.all });
        queryClient.invalidateQueries({ queryKey: stockHistoryKeys.all });
        queryClient.invalidateQueries({ queryKey: reportKeys.sales });

        window.location.href = data.data.invoice_url;
      } else {
        toast.error("Failed to create payment invoice");
      }
    },
  });

  return { checkout: mutate, isPending };
}

export function useTransactions() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: transactionKeys.all,
    queryFn: async () => {
      const transactions = await getTransations();
      if ("error" in transactions) {
        throw new Error(transactions.error);
      }
      return transactions;
    },
  });

  return { transactions: data, isPending, isError, error };
}

export function useTodayKpis() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: transactionKeys.kpi(),
    queryFn: async () => {
      const todayKpi = await getTodayKpis();
      if ("error" in todayKpi) {
        throw new Error(todayKpi.error);
      }
      return todayKpi;
    },
  });

  return { kpis: data, isPending, error, isError };
}

export function useRefundMutation({
  saleId,
  onRefundComplete,
}: {
  saleId: number;
  onRefundComplete: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: TRefund) => {
      const result = await refund({ payload, saleId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Refund Failed", {
        description:
          errorMessage || "Could not complete the refund. Please try again.",
      });
    },
    onSuccess: (data) => {
      toast.success("Refund Successful", {
        description: data?.message || "Refund completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      onRefundComplete();
    },
  });

  return { refundMutation: mutate, isPending };
}

export function useDetailTransaction(transactionId: number) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: transactionKeys.detail(transactionId),
    queryFn: async () => {
      const transaction = await detailTransaction(transactionId);
      if ("error" in transaction) {
        throw new Error(transaction.error);
      }
      return transaction;
    },
    enabled: !!transactionId,
  });

  return { transaction: data, isPending, isError, error };
}

export function useAssignCustomerToSale({
  onAssignSuccess,
}: {
  onAssignSuccess: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: { payload: TCustomer; saleId: number }) => {
      const result = await assignCustomerToSale(params);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Assign Customer to Sale Failed", {
        description:
          errorMessage || "Cannot assign customer to sale. Please try again.",
      });
    },
    onSuccess: (data) => {
      toast.success("Assign customer to sale Successful", {
        description:
          data?.message || "assign customer to sale completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
      onAssignSuccess();
    },
  });

  return { assignCustomerToSaleMutation: mutate, isPending };
}
