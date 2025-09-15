"use server";

import { createApiServer } from "@/lib/axios-server";
import { ApiResponse } from "@/types/response";
import { TSupplier } from "@/types/supplier";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getSuppliers = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TSupplier[]>>("suppliers");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching suppliers", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createSupplier = async (formData: FormData) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TSupplier[]>>(
      "suppliers",
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
    console.error("Error creating supplier", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailSupplier = async (supplierId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TSupplier>>(
      `suppliers/${supplierId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching supplier details", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateSupplier = async (params: {
  supplierId: number;
  formData: FormData;
}) => {
  const { supplierId, formData } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      `suppliers/${supplierId}`,
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
    console.error("Error update supplier", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteSupplier = async (supplierId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(`suppliers/${supplierId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete supplier", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteBulkSupplier = async (supplierIds: number[]) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>("suppliers", {
      data: { ids: supplierIds },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete bulk supplier", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
