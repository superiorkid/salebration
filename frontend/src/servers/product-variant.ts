"use server";

import { createApiServer } from "@/lib/axios-server";
import { TProductVariant } from "@/types/product-variant";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getProductVariants = async () => {
  try {
    const api = createApiServer(await cookies());
    const response =
      await api.get<ApiResponse<TProductVariant[]>>("product-variants");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching product variants", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const getProductVariantDetail = async (variantId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TProductVariant>>(
      `product-variants/${variantId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching product detail", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const searchProducts = async (keyword: string, supplierId?: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TProductVariant[]>>(
      `/product-variants/search`,
      {
        params: { keyword, ...(!!supplierId && { supplier_id: supplierId }) },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error searching products", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
