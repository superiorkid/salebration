"use server";

import { createApiServer } from "@/lib/axios-server";
import { TInvoice } from "@/types/invoice";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getInvoice = async (invoiceNumber: string) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TInvoice>>("invoices", {
      params: { invoice_number: invoiceNumber },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };

    console.error("Failed to fetch invoice", errorResponse.response);

    return {
      error: errorResponseData.message || "Failed to fetch invoice",
      status: errorResponseData.status,
    };
  }
};

export const downloadInvoicePdf = async (invoiceId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post(
      `invoices/${invoiceId}/download-pdf`,
      undefined,
      { responseType: "blob", headers: { "Content-Type": "application/pdf" } },
    );

    let filename = `invoice-${invoiceId}.pdf`;
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/"/g, "");
      }
    }

    const blob = new Blob([response.data], { type: "application/pdf" });
    const text = await blob.text();
    console.log("Raw PDF response text (should NOT be HTML/JSON):", text);

    return {
      data: new Blob([response.data], { type: "application/pdf" }),
      filename: filename,
    };
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };

    console.error("Failed to download invoice", errorResponse.response);

    return {
      error: errorResponseData.message || "Failed to download invoice",
      status: errorResponseData.status,
    };
  }
};
