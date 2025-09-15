"use server";

import { Category } from "@/app/(app)/inventory/categories/category-schema";
import { createApiServer } from "@/lib/axios-server";
import { TProductCategory } from "@/types/product-category";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getProductCategories = async ({
  parent_only,
}: {
  parent_only: boolean;
}) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TProductCategory[]>>(
      `categories`,
      { params: { parent_only } },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching product categories", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createCategory = async (values: Category) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>("categories", values);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error create category", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailCategory = async (categoryId: number) => {
  const api = createApiServer(await cookies());
  try {
    const response = await api.get<ApiResponse<TProductCategory>>(
      `categories/${categoryId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error(
      "Error fetching detail product categories",
      errorResponse.message,
    );
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateCategory = async (params: {
  categoryId: number;
  values: Category;
}) => {
  const { categoryId, values } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.put<ApiResponse>(
      `categories/${categoryId}`,
      values,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error update category", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteCategory = async (categoryId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(`categories/${categoryId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete category", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteBulkCategory = async (categoryIds: number[]) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>("categories", {
      data: {
        ids: categoryIds,
      },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete bulk category", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
