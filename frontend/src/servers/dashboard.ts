"use server";

import { createApiServer } from "@/lib/axios-server";
import { TDashboardMetric } from "@/types/dashboard";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getDashboardMetrics = async () => {
  try {
    const api = createApiServer(await cookies());
    const response =
      await api.get<ApiResponse<TDashboardMetric>>("dashboard/metrics");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching dashboard metrics", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
