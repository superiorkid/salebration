"use server";

import { TRoleSchema } from "@/app/(app)/settings/roles/role-schema";
import { createApiServer } from "@/lib/axios-server";
import { ApiResponse } from "@/types/response";
import { TRole } from "@/types/role";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getRoles = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TRole[]>>("roles");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching roles", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createRole = async (values: TRoleSchema) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse<TRole[]>>("roles", values, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error creating role", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailRole = async (roleId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TRole>>(`roles/${roleId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching role details", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateRole = async (params: {
  roleId: number;
  values: TRoleSchema;
}) => {
  const { roleId, values } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.put<ApiResponse>(`roles/${roleId}`, values, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error update role", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const deleteRole = async (roleId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(`roles/${roleId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete role", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
