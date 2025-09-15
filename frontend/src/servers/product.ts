"use server";

import { createApiServer } from "@/lib/axios-server";
import { TProduct } from "@/types/product";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getProducts = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TProduct[]>>(`products`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching products", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createProduct = async (formData: FormData) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(`products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error creating product", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailProduct = async (productId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TProduct>>(
      `products/${productId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching product", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateProduct = async (params: {
  formData: FormData;
  productId: number;
}) => {
  const { formData, productId } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      `products/${productId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error updating product", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(`products/${productId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error deleting product", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
