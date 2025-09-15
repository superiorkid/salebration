"use server";

import { TLogin } from "@/app/(authentication)/enter/login-schema";
import { env } from "@/env";
import { createApiServer } from "@/lib/axios-server";
import { ApiResponse } from "@/types/response";
import { TUser } from "@/types/user";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { cache } from "react";

export const loginAction = async (values: TLogin) => {
  const cookieStore = await cookies();
  try {
    const api = createApiServer(cookieStore);
    const response = await api.post<
      ApiResponse<{ access_token: string; refresh_token: string }>
    >("auth/sign-in", values);

    const responseData = response.data;

    cookieStore.set({
      name: env.ACCESS_TOKEN_NAME,
      value: responseData.data?.access_token as string,
      maxAge: Number(env.ACCESS_TOKEN_EXPIRATION),
      path: "/",
      domain: undefined,
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    cookieStore.set({
      name: env.REFRESH_TOKEN_NAME,
      value: responseData.data?.refresh_token as string,
      maxAge: Number(env.REFRESH_TOKEN_EXPIRATION),
      path: "/",
      domain: undefined,
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    return responseData;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error during login process", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const logOutAction = async () => {
  const cookieStore = await cookies();
  try {
    const api = createApiServer(cookieStore);
    const response = await api.delete<ApiResponse>("auth/sign-out");

    cookieStore.delete(env.ACCESS_TOKEN_NAME);
    cookieStore.delete(env.REFRESH_TOKEN_NAME);

    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    const errorResponseData = errorResponse.response?.data as {
      message: string;
      status: number;
    };
    console.error("Error during logout process", errorResponse.response);
    return {
      error: errorResponseData.message,
      status: errorResponseData.status,
    };
  }
};

export const getSessionAction = cache(async () => {
  try {
    const api = createApiServer(await cookies());
    const response = await api.get<ApiResponse<TUser>>("auth/me");
    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;
    console.error("Failed to retrieve session data", errorResponse.response);
    return null;
  }
});
