import { useFetchInstance } from "@/hooks/fetchInstance";
import { ApiResponse } from "@/types/common";
import { PaginationMeta } from "@/types/pagination";
import { TourListPageType, TourResponse } from "@/types/tour";
import { useCallback } from "react";

const buildQS = (query?: Record<string, string | number | undefined>) => {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
};

export const useTourService = () => {
  const { get, post, patch, del } = useFetchInstance();

  // Tạo tour (agency)
  const createTour = (
    payload: FormData
  ): Promise<ApiResponse<TourResponse>> => {
    return post<TourResponse>("/tours/create/", payload, true);
  };

  // List tour của đại lý (có pagination)
  const getListTour = useCallback(
    (
      query?: Record<string, string | number | undefined>
    ): Promise<ApiResponse<TourListPageType[], PaginationMeta>> => {
      return get<TourListPageType[], PaginationMeta>(
        `/tours/my/${buildQS(query)}`,
        true
      );
    },
    [get]
  );

  // Chi tiết tour để quản lý
  const getDetailTour = (id: string): Promise<ApiResponse<TourResponse>> => {
    return get<TourResponse>(`/tours/${id}/manage/`, true);
  };

  // Cập nhật tour
  const updateTour = (
    id: string,
    payload: FormData
  ): Promise<ApiResponse<TourResponse>> => {
    return patch<TourResponse>(`/tours/${id}/manage/`, payload, true);
  };

  // Xóa tour
  const deleteTour = useCallback(
    (id: string): Promise<ApiResponse<{ message: string }>> => {
      return del<{ message: string }>(`/tours/${id}/manage/`, true);
    },
    [del]
  );

  // Detail public tour
  const getDetailPublicTour = (
    id: string
  ): Promise<ApiResponse<TourResponse>> => {
    return get<TourResponse>(`/tours/${id}/`, false);
  };

  // Search tour (thực chất cũng là list + q=..., có thể coi như list)
  const searchTour = (
    q: string
  ): Promise<ApiResponse<TourListPageType[], PaginationMeta>> => {
    return get<TourListPageType[], PaginationMeta>(
      `/tours/?q=${encodeURIComponent(q)}`,
      false
    );
  };

  return {
    createTour,
    getDetailTour,
    getListTour,
    updateTour,
    getDetailPublicTour,
    searchTour,
    deleteTour,
  };
};
