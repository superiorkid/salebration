"use server";

import { createApiServer } from "@/lib/axios-server";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function updateReceivedQuantity({
  purchaseOrderItemId,
  receivedQuantity,
}: {
  purchaseOrderItemId: number;
  receivedQuantity: number;
}) {
  try {
    const api = createApiServer(await cookies());
    const response = await api.put<ApiResponse>(
      `purchase-order-items/${purchaseOrderItemId}`,
      {
        received_quantity: receivedQuantity,
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
    console.error("Error update receive quantity", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
}
