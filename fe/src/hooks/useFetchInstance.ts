// "use client";
// import { useAuth } from "@/contexts/AuthContext";
// import { ApiResponse } from "@/types/common";
// import { fetchInstance, HttpMethod } from "@/services/fetchInstance";

// export const useFetchInstance = () => {
//   const { access, setAccess } = useAuth();

//   const refreshAccessToken = async (): Promise<boolean> => {
//     try {
//       const res = await fetchInstance("/users/refresh/", "POST");
//       if (!res.ok) return false;
//       const data = await res.json();
//       if (data?.access) {
//         setAccess(data.access);
//         return true;
//       }
//       return false;
//     } catch {
//       return false;
//     }
//   };

//   const request = async <T>(
//     url: string,
//     method: HttpMethod,
//     body?: any,
//     requireAuth = false
//   ): Promise<ApiResponse<T>> => {
//     try {
//       let response = await fetchInstance<T>(
//         url,
//         method,
//         body,
//         requireAuth ? access ?? undefined : undefined
//       );

//       // Nếu 401 → thử refresh token
//       if (response.status === 401 && requireAuth) {
//         const refreshed = await refreshAccessToken();
//         if (refreshed) {
//           response = await fetchInstance<T>(
//             url,
//             method,
//             body,
//             access ?? undefined
//           );
//         }
//       }

//       const isJson = response.headers
//         .get("content-type")
//         ?.includes("application/json");
//       const json = isJson ? await response.json() : null;

//       if (!response.ok) {
//         return {
//           success: false,
//           status: response.status,
//           message: json?.detail || json?.message || "Yêu cầu thất bại.",
//           error: json,
//           data: null,
//           meta: null,
//         };
//       }

//       return {
//         success: true,
//         status: response.status,
//         message: "Request successful",
//         data: json as T,
//         error: null,
//         meta: null,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         status: error?.status || 0,
//         message: error?.message || "Không thể kết nối tới máy chủ",
//         error: error?.error || null,
//         data: null,
//         meta: null,
//       };
//     }
//   };

//   return {
//     get: <T>(url: string, requireAuth = false) =>
//       request<T>(url, "GET", undefined, requireAuth),
//     post: <T>(url: string, body: any, requireAuth = false) =>
//       request<T>(url, "POST", body, requireAuth),
//     put: <T>(url: string, body: any, requireAuth = false) =>
//       request<T>(url, "PUT", body, requireAuth),
//     patch: <T>(url: string, body: any, requireAuth = false) =>
//       request<T>(url, "PATCH", body, requireAuth),
//     del: <T>(url: string, requireAuth = false) =>
//       request<T>(url, "DELETE", undefined, requireAuth),
//   };
// };
