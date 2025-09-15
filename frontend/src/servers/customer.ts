"use server";

import { TCustomer as TCustomerSchema } from "@/app/(app)/sales/customer-schema";
import { createApiServer } from "@/lib/axios-server";
import { TCustomer } from "@/types/customer";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getCustomers = async (searchTerm?: string) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TCustomer[]>>("customers", {
      params: { search: searchTerm },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching customers", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateCustomer = async (params: {
  customerId: number;
  values: TCustomerSchema;
}) => {
  const { customerId, values } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      `customers/${customerId}`,
      values,
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error update customer", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const getCustomer = async (customerId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TCustomer>>(
      `customers/${customerId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching customer details", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteCustomer = async (customerId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(`customers/${customerId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete customer", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
