"use server";

import { createApiServer } from "@/lib/axios-server";
import { TExpense } from "@/types/expense";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getExpenses = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TExpense[]>>("expenses");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching expenses", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailExpense = async (expenseId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TExpense>>(
      `expenses/${expenseId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching expense details", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createExpense = async (formData: FormData) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TExpense[]>>(
      "expenses",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error creating expense", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateExpense = async (params: {
  expenseId: number;
  formData: FormData;
}) => {
  const { expenseId, formData } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      `expenses/${expenseId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error update expense", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteExpense = async (expenseId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(`expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete expense", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
