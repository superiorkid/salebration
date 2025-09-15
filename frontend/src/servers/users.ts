"use server";

import {
  TUpdatePasswordSchema,
  TUserSchema,
} from "@/app/(app)/settings/users/user-schema";
import { createApiServer } from "@/lib/axios-server";
import { ApiResponse } from "@/types/response";
import { TUser } from "@/types/user";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const getUsers = async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TUser[]>>("users");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Failed to retrieve users", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const createUser = async (values: TUserSchema) => {
  const { confirmPassword, ...restValue } = values;
  try {
    const api = createApiServer(await cookies());
    const response = await api.post<ApiResponse>("users", {
      ...restValue,
      password_confirmation: confirmPassword,
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error creating user", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const detailUser = async (userId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TUser>>(`users/${userId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error fetching user details", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateUser = async (params: {
  userId: number;
  values: Pick<TUserSchema, "email" | "name" | "role">;
}) => {
  const { userId, values } = params;
  try {
    const api = createApiServer(await cookies());
    const response = await api.put<ApiResponse>(`users/${userId}`, values);
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

export const deleteUser = async (userId: number) => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.delete<ApiResponse>(`users/${userId}`);
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error delete user", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const updateUserPassword = async (params: {
  userId: number;
  values: TUpdatePasswordSchema;
}) => {
  const { userId, values } = params;
  const { confirmPassword, password } = values;
  try {
    const api = createApiServer(await cookies());
    const response = await api.put<ApiResponse>(`users/${userId}/password`, {
      password,
      password_confirmation: confirmPassword,
    });
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error update user password", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};
