"use server";

import { TReorderCancelled } from "@/app/(app)/inventory/reorders/reorder-cancelled.schema";
import { TReorderWithVariantId } from "@/app/(app)/inventory/stock-managements/reorder/reorder-schema";
import { TOrderAccepted } from "@/app/(supplier)/supplier/confirmation/order-accepted-schema";
import { TOrderRejected } from "@/app/(supplier)/supplier/confirmation/order-rejected-schema";
import { TValidateOrderToken } from "@/app/(supplier)/supplier/confirmation/validate-order-token-schema";
import { createApiServer } from "@/lib/axios-server";
import { TReorder } from "@/types/reorder";
import { ApiResponse } from "@/types/response";
import { TValidateOrderData } from "@/types/validate-order-data";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const createReorder = async (values: TReorderWithVariantId) => {
  const { expectedDeliveryDate, productVariantId, quantity, notes } = values;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      "reorders",
      {
        quantity,
        notes,
        product_variant_id: productVariantId,
        expected_at: expectedDeliveryDate,
      },
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
    console.error("Error reorder", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const getReorders = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TReorder[]>>("reorders");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching reorders", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const markReorderAsReceive = async (reorderId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      `reorders/${reorderId}/receive`,
      undefined,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error mark reorder as receive", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const markReorderAsCancelled = async ({
  reorderId,
  values,
}: {
  reorderId: number;
  values: TReorderCancelled;
}) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      `reorders/${reorderId}/cancel`,
      { cancellation_reason: values.cancellationReason },
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
    console.error("Error mark reorder as cancelled", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteReorder = async (reorderId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(`reorders/${reorderId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete reorder", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const validateReorderToken = async (values: TValidateOrderToken) => {
  const { orderId, token } = values;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TValidateOrderData>>(
      "reorders/validate-reorder-token",
      {
        token,
        reorder_id: orderId,
      },
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
    console.error("Error validate reorder token", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailReorder = async (reorderId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TReorder>>(
      `reorders/${reorderId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching reorder details", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const markReorderAsAccepted = async (
  reorderId: number,
  values: TOrderAccepted,
  token: string,
) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TReorder>>(
      `reorders/${reorderId}/accept`,
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
    console.error("Error mark reorder as accepted", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const markReorderAsRejected = async (
  reorderId: number,
  values: TOrderRejected,
  token: string,
) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TReorder>>(
      `reorders/${reorderId}/reject`,
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
    console.error("Error mark reorder as rejected", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
