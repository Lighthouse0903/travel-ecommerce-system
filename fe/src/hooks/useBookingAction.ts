"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useBookingService } from "@/services/bookingService";
import type { BookingListItem, CreateBookingRequest } from "@/types/booking";
import type { PaginationMeta } from "@/types/pagination";

import { useAuth } from "@/contexts/AuthContext";
import { useLoginModal } from "@/contexts/LoginModalContext";

const DRAFT_BOOKING_KEY = (userId: string) => `draft_booking_form_${userId}`;
const PENDING_BOOKING_KEY = (userId: string) => `pending_booking_${userId}`;

const saveDraftBooking = (userId: string, payload: CreateBookingRequest) => {
  localStorage.setItem(DRAFT_BOOKING_KEY(userId), JSON.stringify(payload));
};

const clearDraftBooking = (userId: string) => {
  localStorage.removeItem(DRAFT_BOOKING_KEY(userId));
};

const getPendingBookingId = (userId: string) => {
  return localStorage.getItem(PENDING_BOOKING_KEY(userId));
};

const setPendingBookingId = (userId: string, bookingId: string) => {
  localStorage.setItem(PENDING_BOOKING_KEY(userId), bookingId);
};

const clearPendingBookingId = (userId: string) => {
  localStorage.removeItem(PENDING_BOOKING_KEY(userId));
};

// Custom hook tạo booking cho kahchs hàng

export const useBookingAction = () => {
  const router = useRouter();
  const { createBooking, getDetailBookingCustomer } = useBookingService();
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();

  const submitCreateBooking = async (payload: CreateBookingRequest) => {
    const userId = user?.user_id;

    if (!userId) {
      toast.warning("Bạn cần đăng nhập để đặt tour");
      openLoginModal();
      return { ok: false as const };
    }

    const pendingId = getPendingBookingId(userId);
    console.log("PendingID: ", pendingId);

    if (pendingId) {
      const check = await getDetailBookingCustomer(pendingId);
      console.log("check: ", check);
      const status = check.data?.status;
      if (status === "pending") {
        toast(
          "Bạn đang có đơn chưa hoàn tất. Chuyển đến trang trạng thái đơn hàng"
        );
        router.push(`/dashboard/orders/${pendingId}`);
        return { ok: false as const, redirected: true as const };
      }
      if (status === "paid_waiting") {
        toast("Bạn đang có đơn chưa hoàn tất. Chuyển đến trang thanh toán");
        router.push(`/dashboard/orders/${pendingId}`);
        return { ok: false as const, redirected: true as const };
      }
      // paid / rejected / hoặc không lấy được status -> clear để tạo đơn mới
      clearPendingBookingId(userId);
    }

    saveDraftBooking(userId, payload);

    const res = await createBooking(payload);

    if (res.success) {
      const bookingId = res.data?.booking_id;

      if (!bookingId) {
        toast.error("Có lỗi xảy ra, thiếu mã booking");
        return { ok: false as const };
      }

      clearDraftBooking(userId);
      setPendingBookingId(userId, bookingId);

      toast.success(res.message || "Tạo booking thành công");
      router.push(`/dashboard/orders/${bookingId}`);
      return { ok: true as const, bookingId };
    }

    const errors = res.error?.errors;
    const firstKey = errors ? Object.keys(errors)[0] : null;

    const msg =
      errors?.non_field_errors?.[0] ||
      (firstKey && errors?.[firstKey]?.[0]) ||
      res.error?.message ||
      res.message ||
      "Không thể tạo booking";

    toast.error(msg);
    return { ok: false as const };
  };

  return { submitCreateBooking };
};

// custom hook cho khách hàng xem đơn đặt tour

interface UseCustomerBookingsParams {
  page: number;
  pageSize: number;
}

export const useCustomerBookings = ({
  page,
  pageSize,
}: UseCustomerBookingsParams) => {
  const { getListBookingCustomer } = useBookingService();

  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await getListBookingCustomer({
          page,
          page_size: pageSize,
        });

        if (!alive) return;

        if (res.success) {
          setBookings(res.data ?? []);
          setMeta((res.meta as PaginationMeta) ?? null);
        } else {
          setBookings([]);
          setMeta(null);
          toast.error(
            typeof res.message === "string"
              ? res.message
              : "Lấy danh sách đơn thất bại"
          );
        }
      } catch {
        if (!alive) return;
        toast.error("Lỗi hệ thống, vui lòng thử lại sau.");
        setBookings([]);
        setMeta(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      alive = false;
    };
  }, [getListBookingCustomer, page, pageSize]);

  return { bookings, meta, loading };
};
