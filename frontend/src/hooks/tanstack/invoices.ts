import { invoiceKeys } from "@/lib/query-keys";
import { downloadInvoicePdf, getInvoice } from "@/servers/invoice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export function useInvoice(invoiceNumber: string) {
  const { data, isPending, error, isError } = useQuery({
    queryKey: invoiceKeys.detail(invoiceNumber),
    queryFn: async () => {
      const invoice = await getInvoice(invoiceNumber);
      if ("error" in invoice) {
        throw new Error(invoice.error);
      }
      return invoice;
    },
    enabled: !!invoiceNumber,
    refetchOnWindowFocus: false,
  });

  return { invoice: data, isPending, isError, error };
}

export function useDownloadInvoicePdf(invoiceId: number) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await downloadInvoicePdf(invoiceId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error: AxiosError) => {
      const errorMessage = !error.response
        ? error.message
        : (error.response.data as { message: string }).message;
      toast.error("Download Failed", {
        description: errorMessage || "Something went wrong",
      });
    },
    onSuccess: (data) => {
      saveAs(data.data, data.filename);
      toast.success("Download Started", {
        description: "The invoice PDF is being downloaded",
      });
    },
  });

  return { downloadInvoiceMutation: mutate, isPending };
}
