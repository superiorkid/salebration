"use server";

import { createApiServer } from "@/lib/axios-server";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getStockHistories = async (productVariantId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse>("stock-histories", {
      params: { variant_id: productVariantId },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching stock histories", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
