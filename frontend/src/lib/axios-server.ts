import { env } from "@/env";
import axios, { AxiosInstance } from "axios";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function createApiServer(
  cookies: ReadonlyRequestCookies,
): AxiosInstance {
  const instance = axios.create({
    baseURL: env.BACKEND_URL,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  let isRefreshing = false;

  instance.interceptors.request.use((config) => {
    const accessToken = cookies.get(env.ACCESS_TOKEN_NAME)?.value;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) return Promise.reject(error);

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = cookies.get(env.REFRESH_TOKEN_NAME)?.value;
        if (!refreshToken) {
          return Promise.reject(error);
        }

        try {
          const response = await axios.get(`${env.BACKEND_URL}/auth/refresh`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          const isProduction = env.NODE_ENV === "production";

          cookies.set("access_token", response.data.data.access_token, {
            maxAge: env.ACCESS_TOKEN_EXPIRATION,
            path: "/",
            domain: undefined,
            secure: isProduction,
            httpOnly: true,
            sameSite: "lax",
          });

          isRefreshing = false;

          // Retry original request
          return instance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          console.error("Token refresh failed (server):", refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}
