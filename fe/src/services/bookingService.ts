import { useFetchInstance } from "@/hooks/fetchInstance";
import {
  BookingListItem,
  BookingDetail,
  BookingStatus,
  CreateBookingRequest,
} from "@/types/booking";
import { ApiResponse } from "@/types/common";
import { PaginationMeta } from "@/types/pagination";
import { useCallback } from "react";

// helper phục vụ cho Query param
const buildQS = (query?: Record<string, string | number | undefined>) => {
  if (!query) return "";
  const param = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") param.set(key, String(value));
  });
  const s = param.toString();
  return s ? `?${s}` : "";
};

export const useBookingService = () => {
  const { get, post, patch } = useFetchInstance();

  // Hàm danh cho khách hàng
  // hàm gọi API create booking
  const createBooking = (
    payload: CreateBookingRequest
  ): Promise<ApiResponse<BookingDetail>> => {
    return post<BookingDetail>(`/bookings/create/`, payload, true);
  };

  // hàm gọi API lấy chi tiết booking của 1 khách hàng
  const getDetailBookingCustomer = (
    bookingId: string
  ): Promise<ApiResponse<BookingDetail>> => {
    return get<BookingDetail>(`/bookings/my/${bookingId}`, true);
  };

  // hàm gọi API lấy danh sách booking của khách hàng
  const getListBookingCustomer = useCallback(
    (
      query?: Record<string, string | number | undefined>
    ): Promise<ApiResponse<BookingListItem[], PaginationMeta>> => {
      return get<BookingListItem[], PaginationMeta>(
        `/bookings/my/${buildQS(query)}`,
        true
      );
    },
    [get]
  );

  // Hàm dành cho đại lý
  // hàm gọi API lấy chi tiết booking của 1 khách hàng bên đại lý
  const getDetailBookingAgency = (
    bookingId: string
  ): Promise<ApiResponse<BookingDetail>> => {
    return get<BookingDetail>(`/bookings/agency/${bookingId}`, true);
  };

  // hàm gọi API lấy danh sách booking của khách hàng
  const getListBookingAgency = useCallback(
    (
      query?: Record<string, string | number | undefined>
    ): Promise<ApiResponse<BookingListItem[], PaginationMeta>> => {
      return get<BookingListItem[], PaginationMeta>(
        `/bookings/agency/${buildQS(query)}`,
        true
      );
    },
    [get]
  );

  // hàm gọi APi cập nhật status: xác nhận hoặc hủy đơn hàng

  const updateStatusBooking = (
    bookingId: string,
    status: BookingStatus,
    rejected_reason?: string
  ): Promise<ApiResponse<BookingDetail>> => {
    return patch<BookingDetail>(
      `/bookings/${bookingId}/status/`,
      { status, rejected_reason },
      true
    );
  };

  return {
    createBooking,
    getDetailBookingCustomer,
    getListBookingCustomer,
    getListBookingAgency,
    getDetailBookingAgency,
    updateStatusBooking,
  };
};
