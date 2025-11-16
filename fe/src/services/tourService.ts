import { useFetchInstance } from "@/hooks/fetchInstance";
import { ApiResponse } from "@/types/common";
import { TourListPageType, TourResponse } from "@/types/tour";

export const useTourService = () => {
  const { get, post, put, patch, del } = useFetchInstance();

  // ======Các hàm dành cho AGENCy======
  // hàm gọi API tạo mới tour
  const createTour = (
    payload: FormData
  ): Promise<ApiResponse<TourResponse>> => {
    return post<TourResponse>("/tours/", payload, true);
  };

  // hàm gọi APi lấy list danh sách tour đã đăng của 1 đại lý
  const getListTour = (): Promise<ApiResponse<TourListPageType[]>> => {
    return get<TourListPageType[]>(`/tours/my-tours/`, true);
  };

  // hàm gọi API lấy thông tin chi tiết 1 tour
  const getDetailTour = (id: string): Promise<ApiResponse<TourResponse>> => {
    return get<TourResponse>(`/tours/manage/${id}/`, true);
  };

  // hàm gọi API cập nhật thông tin chi tiết 1 tour
  const updateTour = (
    id: string,
    payload: FormData
  ): Promise<ApiResponse<TourResponse>> => {
    return patch<TourResponse>(`/tours/manage/${id}/`, payload, true);
  };

  // ======Các hàm dành cho Khách Hàng ======

  // hàm gọi API lấy thông tin list public tour
  const getListPublicTour = (): Promise<ApiResponse<TourListPageType[]>> => {
    return get<TourListPageType[]>(`/tours/public/`, false);
  };

  // hàm gọi API lấy thông tin 1 tour Public chi tiết
  const getDetailPublicTour = (
    id: string
  ): Promise<ApiResponse<TourResponse>> => {
    return get<TourResponse>(`/tours/public/${id}/`, false);
  };
  return {
    createTour,
    getDetailTour,
    getListTour,
    updateTour,
    getListPublicTour,
    getDetailPublicTour,
  };
};
