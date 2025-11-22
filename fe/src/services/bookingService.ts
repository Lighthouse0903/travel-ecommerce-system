import { useFetchInstance } from "@/hooks/fetchInstance";
import {
  BookingDetail,
  BookingListPage,
  BookingRequest,
  BookingResponse,
  BookingStatus,
} from "@/types/booking";
import { ApiResponse } from "@/types/common";

export const useBookingService = () => {
  const { get, post, patch, put, del } = useFetchInstance();

  //=========== Hàm danh cho khách hàng==============
  // hàm gọi API create booking
  const createBooking = (
    payload: BookingRequest
  ): Promise<ApiResponse<BookingResponse>> => {
    return post<BookingResponse>(`/bookings/create/`, payload, true);
  };

  // hàm gọi API lấy chi tiết booking của 1 khách hàng
  const getDetailBookingCustomer = (
    bookingId: string
  ): Promise<ApiResponse<BookingDetail>> => {
    return get<BookingDetail>(`/bookings/my/${bookingId}`, true);
  };

  // hàm gọi API lấy danh sách booking của khách hàng
  const getListBookingCustomer = (): Promise<
    ApiResponse<BookingListPage[]>
  > => {
    return get<BookingListPage[]>(`/bookings/my/`, true);
  };

  //=========== Hàm dành cho đại lý==============

  // hàm gọi API lấy chi tiết booking của 1 khách hàng bên đại lý
  const getDetailBookingAgency = (
    bookingId: string
  ): Promise<ApiResponse<BookingDetail>> => {
    return get<BookingDetail>(`/bookings/agency/${bookingId}`, true);
  };

  // hàm gọi API lấy danh sách booking của khách hàng
  const getListBookingAgency = (): Promise<ApiResponse<BookingListPage[]>> => {
    return get<BookingListPage[]>(`/bookings/agency/`, true);
  };

  // hàm gọi APi cập nhật status: xác nhận hoặc hủy đơn hàng

  const updateStatusBooking = (
    bookingId: string,
    status: BookingStatus
  ): Promise<ApiResponse<BookingDetail>> => {
    return patch<BookingDetail>(
      `/bookings/${bookingId}/status/`,
      { status },
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
