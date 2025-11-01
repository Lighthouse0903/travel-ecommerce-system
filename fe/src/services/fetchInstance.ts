const API_URL = "http://127.0.0.1:8000/api";
import { ApiResponse } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const useFetchInstance = () => {
  const { access, setAccess } = useAuth();

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/users/refresh/`, {
        method: "POST",
        credentials: "include",
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

  const request = async <T>(
    url: string,
    method: HttpMethod,
    body?: any,
    requireAuth = false
  ): Promise<ApiResponse<T>> => {
    let token = access;

    const headers = new Headers({ "Content-Type": "application/json" });
    if (requireAuth && token) headers.set("Authorization", `Bearer ${token}`);

    const options: RequestInit = {
      method,
      headers,
      credentials: "include",
    };
    if (body) options.body = JSON.stringify(body);

    let response = await fetch(`${API_URL}${url}`, options);

    // Nếu 401 thì thử refresh lại
    if (response.status === 401 && requireAuth) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        response = await fetch(`${API_URL}${url}`, {
          ...options,
          headers,
        });
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
        message:
          json?.detail ||
          json?.message ||
          "Yêu cầu thất bại, vui lòng thử lại.",
        error: json,
        data: null,
        meta: null,
      };
    }

    return {
      success: true,
      status: response.status,
      message: json?.message || "Request successful",
      data: (json?.data ?? json) as T,
      error: null,
      meta: null,
    };
  };

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
