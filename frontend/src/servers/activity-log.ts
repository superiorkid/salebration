"use server";

import { createApiServer } from "@/lib/axios-server";
import { TActivityLog } from "@/types/activity-log";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getActivityLogs = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TActivityLog[]>>("logs");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching activity logs", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
