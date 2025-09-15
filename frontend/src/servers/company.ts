"use server";

import { createApiServer } from "@/lib/axios-server";
import { TCompany } from "@/types/company";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getCompany = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TCompany>>("company");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching company details", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateCompnayInformation = async (formData: FormData) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>("company", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error update company", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
