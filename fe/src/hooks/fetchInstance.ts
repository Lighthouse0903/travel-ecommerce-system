import { ApiResponse, ApiError, ApiFieldErrors } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL! + "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

let refreshPromise: Promise<string | null> | null = null;

export const useFetchInstance = () => {
  const { access, refreshAccessToken } = useAuth();

  const doRefreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      const newToken = await refreshAccessToken();
      return newToken;
    })();

    try {
      return await refreshPromise;
    } finally {
      refreshPromise = null;
    }
  }, [refreshAccessToken]);

  const request = useCallback(
    async <T, M = null>(
      url: string,
      method: HttpMethod,
      body?: unknown,
      requireAuth = false
    ): Promise<ApiResponse<T, M>> => {
      let token = access;
      // refresh trước nếu cần auth mà chưa có access (vừa reload)
      if (requireAuth && !token) {
        token = await doRefreshAccessToken();
      }
      const headers = new Headers();

      if (!(body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      if (requireAuth && token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const options: RequestInit = {
        method,
        headers,
        credentials: "include",
      };

      if (body) {
        options.body = body instanceof FormData ? body : JSON.stringify(body);
      }

      let response: Response;

      // Lần 1
      try {
        response = await fetch(`${API_URL}${url}`, options);
      } catch {
        const errorPayload: ApiError = {
          message: "Không thể kết nối tới máy chủ.",
        };

        return {
          success: false,
          status: 0,
          message: errorPayload.message,
          error: errorPayload,
          data: null,
          meta: null as M,
        };
      }

      // Nếu 401 và requireAuth → refresh token + retry
      if (response.status === 401 && requireAuth) {
        const newToken = await doRefreshAccessToken();

        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`);

          try {
            response = await fetch(`${API_URL}${url}`, { ...options, headers });
          } catch {
            const errorPayload: ApiError = {
              message: "Không thể kết nối tới máy chủ.",
            };

            return {
              success: false,
              status: 0,
              message: errorPayload.message,
              error: errorPayload,
              data: null,
              meta: null as M,
            };
          }
        }
      }

      // Parse JSON (nếu có)
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const json = isJson ? await response.json() : null;

      // Lấy meta từ BE (nếu có)
      const meta = (json?.meta ?? null) as M;

      // ERROR
      if (!response.ok) {
        const errors = (json?.errors ?? undefined) as
          | ApiFieldErrors
          | undefined;
        const message =
          (typeof json?.message === "string" && json.message) ||
          `Lỗi ${response.status}: Yêu cầu thất bại.`;

        const errorPayload: ApiError = {
          message,
          errors,
        };

        return {
          success: false,
          status: response.status,
          message: errorPayload.message,
          error: errorPayload,
          data: null,
          meta,
        };
      }

      // SUCCESS
      return {
        success: true,
        status: response.status,
        message:
          typeof json?.message === "string" ? json.message : "Thành công",
        data: (json?.data ?? json) as T,
        error: null,
        meta,
      };
    },
    [access, doRefreshAccessToken]
  );

  const get = useCallback(
    <T, M = null>(url: string, requireAuth = false) =>
      request<T, M>(url, "GET", undefined, requireAuth),
    [request]
  );

  const post = useCallback(
    <T, M = null>(url: string, body: unknown, requireAuth = false) =>
      request<T, M>(url, "POST", body, requireAuth),
    [request]
  );

  const put = useCallback(
    <T, M = null>(url: string, body: unknown, requireAuth = false) =>
      request<T, M>(url, "PUT", body, requireAuth),
    [request]
  );

  const patch = useCallback(
    <T, M = null>(url: string, body: unknown, requireAuth = false) =>
      request<T, M>(url, "PATCH", body, requireAuth),
    [request]
  );

  const del = useCallback(
    <T, M = null>(url: string, requireAuth = false) =>
      request<T, M>(url, "DELETE", undefined, requireAuth),
    [request]
  );

  return useMemo(
    () => ({ get, post, put, patch, del }),
    [get, post, put, patch, del]
  );
};
