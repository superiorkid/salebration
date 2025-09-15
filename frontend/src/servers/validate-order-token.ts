"use server";

import { TValidateOrderToken } from "@/app/(supplier)/supplier/confirmation/validate-order-token-schema";
import { createApiServer } from "@/lib/axios-server";
import { ApiResponse } from "@/types/response";
import { TValidateOrderData } from "@/types/validate-order-data";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export default async function validateOrderToken(values: TValidateOrderToken) {
  const { orderId, token, type } = values;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TValidateOrderData>>(
      "validate-order-token",
      {
        token,
        type,
        order_id: orderId,
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
    console.error("Error validate order token", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
}
