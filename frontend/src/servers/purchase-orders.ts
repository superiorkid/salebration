"use server";

import { TPurchaseOrderSchema } from "@/app/(app)/inventory/purchase-orders/add/purchase-orders-schema";
import { TPurchaseOrderCancelled } from "@/app/(app)/inventory/purchase-orders/[purchaseOrderId]/purchase-order-cancelled-schema";
import { createApiServer } from "@/lib/axios-server";
import { TPurchaseOrder } from "@/types/purchase-order";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { TOrderAccepted } from "@/app/(supplier)/supplier/confirmation/order-accepted-schema";
import { TOrderRejected } from "@/app/(supplier)/supplier/confirmation/order-rejected-schema";

export const getPurcaseOrders = async () => {
  try {
    const api = createApiServer(await cookies());
    const response =
      await api.get<ApiResponse<TPurchaseOrder[]>>("purchase-orders");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching purchase orders", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createPurchasOrders = async (values: TPurchaseOrderSchema) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      "purchase-orders",
      {
        supplier_id: values.supplierId,
        expected_at: values.expectedAt,
        notes: values.notes,
        items: values.items.map((value) => ({
          product_variant_id: value.productVariantId,
          quantity: value.quantity,
          unit_price: value.unitPrice,
        })),
      },
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error create purchase orders", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailPurchaseOrder = async (purchaseOrderId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TPurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error(
      "Error fetching purchase orders detail",
      errorResponse.response,
    );
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const markPurchaseOrderAsAccepted = async (
  purchaseOrderId: number,
  values: TOrderAccepted,
  token: string,
) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TPurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}/accept`,
      {
        acceptance_notes: values.acceptance_notes,
      },
      {
        params: {
          token,
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error(
      "Error mark purchase order as accepted",
      errorResponse.response,
    );
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const markPurchaseOrderAsRejected = async (
  purchaseOrderId: number,
  values: TOrderRejected,
  token: string,
) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TPurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}/reject`,
      {
        rejection_reason: values.rejection_reason,
      },
      {
        params: {
          token,
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error(
      "Error mark purchase order as rejected",
      errorResponse.response,
    );
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const markPurchaseOrderAsCancelled = async (
  purchaseOrderId: number,
  values: TPurchaseOrderCancelled,
) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TPurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}/cancel`,
      {
        cancellation_reason: values.cancellation_reason,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error(
      "Error mark purchase order as cancelled",
      errorResponse.response,
    );
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
