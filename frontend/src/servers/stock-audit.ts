"use server";

import { TAuditSchema } from "@/app/(app)/inventory/stock-managements/[productVariantId]/audit/add/audit-schema";
import { createApiServer } from "@/lib/axios-server";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getStockAudits = async (productVariantId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse>("stock-audits", {
      params: { variant_id: productVariantId },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching stock audits", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createStockAudit = async (
  values: TAuditSchema & { productVariantId: number },
) => {
  const { countedQuantity, notes, productVariantId } = values;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>(
      "stock-audits",
      {
        notes,
        product_variant_id: productVariantId,
        counted_quantity: countedQuantity,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error audit stock", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteStockAudit = async (stockAuditId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(
      `stock-audits/${stockAuditId}`,
    );
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete audit", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
