"use server";

import { TExpenseCategoriesSchema } from "@/app/(app)/finance/expense-categories/expense-categories-schema";
import { createApiServer } from "@/lib/axios-server";
import { TExpenseCategory } from "@/types/expense-category";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getExpenseCategoriess = async () => {
  try {
    const api = createApiServer(await cookies());
    const response =
      await api.get<ApiResponse<TExpenseCategory[]>>("expense-categories");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching expense categories", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createExpenseCategory = async (
  values: TExpenseCategoriesSchema,
) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>("expense-categories", values);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error creating category", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteExpenseCategory = async (categoryId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(
      `expense-categories/${categoryId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete expense category", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
