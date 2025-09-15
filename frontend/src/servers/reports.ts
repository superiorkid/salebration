"use server";

import { FinancialPeriodEnum } from "@/enums/financial-period";
import { createApiServer } from "@/lib/axios-server";
import {
  TFinancialReport,
  TFinancialReportParams,
} from "@/types/financial-report";
import { TInventoryFilters, TInventoryReport } from "@/types/inventory-report";
import { ApiResponse } from "@/types/response";
import { TSaleFilters, TSalesReport } from "@/types/sale-report";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getSalesReport = async (filters?: TSaleFilters) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TSalesReport>>("reports/sales", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching sales report", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const getInventoryReport = async (filters?: TInventoryFilters) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TInventoryReport>>(
      "reports/inventory",
      { params: { ...filters, show_low_stock: filters?.showLowStock } },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching inventory report", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const getFinancialReport = async (filters?: TFinancialReportParams) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TFinancialReport>>(
      "reports/financial",
      {
        params: {
          period: filters?.period || FinancialPeriodEnum.MONTHLY,
          start_date: !!filters?.start_date
            ? new Date(filters?.start_date).toISOString()
            : undefined,
          end_date: !!filters?.end_date
            ? new Date(filters.end_date)
            : undefined,
        },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching financial report", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
