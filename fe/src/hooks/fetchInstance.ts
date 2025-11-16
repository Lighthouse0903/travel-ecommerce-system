// src/hooks/fetchInstance.ts
const API_URL = "http://127.0.0.1:8000/api";
import { ApiResponse } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const useFetchInstance = () => {
  const { access, setAccess } = useAuth();

  // Refresh token
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

  // Hàm request gốc
  const request = async <T>(
    url: string,
    method: HttpMethod,
    body?: any,
    requireAuth = false
  ): Promise<ApiResponse<T>> => {
    let token = access;

    const headers = new Headers();

    // Nếu KHÔNG phải FormData thì MỚI set Content-Type JSON
    if (!(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    // Nếu endpoint cần auth thì gắn token
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

    // Gọi API
    let response: Response;
    try {
      response = await fetch(`${API_URL}${url}`, options);
    } catch (err) {
      return {
        success: false,
        status: 0,
        message: "Không thể kết nối tới máy chủ.",
        error: "Không thể kết nối tới máy chủ",
        data: null,
        meta: null,
      };
    }

    // Nếu 401 → thử refresh token
    if (response.status === 401 && requireAuth) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        response = await fetch(`${API_URL}${url}`, { ...options, headers });
      }
    }

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const json = isJson ? await response.json() : null;

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: json?.message || `Lỗi ${response.status}: Yêu cầu thất bại.`,
        error: json,
        data: null,
        meta: null,
      };
    }

    return {
      success: true,
      status: response.status,
      message: json?.message || "Thành công",
      data: (json?.data ?? json) as T,
      error: null,
      meta: json?.meta ?? null,
    };
  };

  // Public API
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
