const API_URL = process.env.NEXT_PUBLIC_API_URL! + "/api";

import { ApiResponse, ApiError, ApiFieldErrors } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const useFetchInstance = () => {
  const { access, setAccess } = useAuth();

  // ================================
  // REFRESH TOKEN
  // ================================
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/users/refresh/`, {
        method: "POST",
        credentials: "include", // refresh token trong cookie
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (data?.access) {
        setAccess(data.access);
        return data.access;
      }

      return null;
    } catch {
      return null;
    }
  };

  // ================================
  // REQUEST CORE
  // ================================
  const request = async <T>(
    url: string,
    method: HttpMethod,
    body?: any,
    requireAuth = false
  ): Promise<ApiResponse<T>> => {
    let token = access;

    const headers = new Headers();

    // Nếu KHÔNG phải FormData → gửi JSON
    if (!(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    // Gắn Authorization nếu cần
    if (requireAuth && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: "include", // để gửi cookie refresh
    };

    if (body)
      options.body = body instanceof FormData ? body : JSON.stringify(body);

    // ================================
    // CALL API
    // ================================
    let response: Response;

    try {
      response = await fetch(`${API_URL}${url}`, options);
    } catch (err) {
      const errorPayload: ApiError = {
        message: "Không thể kết nối tới máy chủ.",
      };

      return {
        success: false,
        status: 0,
        message: errorPayload.message,
        error: errorPayload,
        data: null,
        meta: null,
      };
    }

    // ================================
    // HANDLE 401 → REFRESH TOKEN
    // ================================
    if (response.status === 401 && requireAuth) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        response = await fetch(`${API_URL}${url}`, { ...options, headers });
      }
    }

    // Parse JSON
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    const json = isJson ? await response.json() : null;

    // ================================
    // HANDLE ERROR RESPONSE
    // ================================
    if (!response.ok) {
      const errorPayload: ApiError = {
        message:
          json?.message ||
          json?.detail ||
          `Lỗi ${response.status}: Yêu cầu thất bại.`,
        errors: (json?.errors ?? undefined) as ApiFieldErrors | undefined,
      };

      return {
        success: false,
        status: response.status,
        message: errorPayload.message,
        error: errorPayload,
        data: null,
        meta: null,
      };
    }

    // ================================
    // SUCCESS RESPONSE
    // ================================
    return {
      success: true,
      status: response.status,
      message: json?.message || "Thành công",
      data: (json?.data ?? json) as T,
      error: null,
      meta: json?.meta ?? null,
    };
  };

  // ================================
  // PUBLIC METHODS
  // ================================
  return {
    get: <T>(url: string, requireAuth = false) =>
      request<T>(url, "GET", undefined, requireAuth),
    post: <T>(url: string, body: any, requireAuth = false) =>
      request<T>(url, "POST", body, requireAuth),
    put: <T>(url: string, body: any, requireAuth = false) =>
      request<T>(url, "PUT", body, requireAuth),
    patch: <T>(url: string, body: any, requireAuth = false) =>
      request<T>(url, "PATCH", body, requireAuth),
    del: <T>(url: string, requireAuth = false) =>
      request<T>(url, "DELETE", undefined, requireAuth),
  };
};
