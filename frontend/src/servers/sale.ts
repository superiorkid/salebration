"use server";

import { TCustomer } from "@/app/(app)/sales/customer-schema";
import { TRefund } from "@/app/(app)/sales/transactions/refund-schema";
import { createApiServer } from "@/lib/axios-server";
import { TProcessPayment } from "@/types/process-payment";
import { ApiResponse } from "@/types/response";
import { TSale } from "@/types/sale";
import { TTransactionKpis } from "@/types/transaction-kpi";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const processPayment = async (payload: TProcessPayment) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>("sales", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error process payment", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const checkout = async (
  params: Pick<TProcessPayment, "total" | "items" | "payment" | "customer">,
) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<{ invoice_url: string }>>(
      "xendit/invoice",
      params,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error process xendit payment", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const getTransations = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TSale[]>>("sales");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error(
      "Error fetching transactions history",
      errorResponse.response,
    );
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const getTodayKpis = async () => {
  try {
    const api = createApiServer(await cookies());
    const response =
      await api.get<ApiResponse<TTransactionKpis>>("sales/kpis/today");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching transactions KPIs", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const refund = async (params: { saleId: number; payload: TRefund }) => {
  const { saleId, payload } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      `sales/${saleId}/refund`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error process refund", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailTransaction = async (transactionId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TSale>>(
      `sales/${transactionId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching transaction details", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const assignCustomerToSale = async (params: {
  payload: TCustomer;
  saleId: number;
}) => {
  const { payload, saleId } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.put<ApiResponse>(
      `sales/${saleId}/assign-customer`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error assign custoemr to sale", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
