"use client";

import React, { useMemo, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Minus, Plus, Tag } from "lucide-react";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatPrice";
import { useBookingService } from "@/services/bookingService";
import { CreateBookingRequest } from "@/types/booking";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginModal } from "@/contexts/LoginModalContext";

interface BookingCardViewProps {
  tourId: string;
  departure_location?: string | null;
  price: number;
  childPrice: number;
  finalPrice: number;
  finalChildPrice: number;
  hasDiscount?: boolean;
}

const DRAFT_BOOKING_KEY = (userId: string) => `draft_booking_form_${userId}`;
const PENDING_BOOKING_KEY = (userId: string) => `pending_booking_${userId}`;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const loadDraftBooking = (tourId: string, userId: string) => {
  try {
    const key = DRAFT_BOOKING_KEY(userId);
    const draftStr = localStorage.getItem(key);
    if (!draftStr) return null;
    const draft = JSON.parse(draftStr) as CreateBookingRequest;
    if (draft.tour !== tourId) return null;
    return draft;
  } catch (error) {
    console.error("Draft form parse error:", error);
    return null;
  }
};

const saveDraftBooking = (userId: string, payload: CreateBookingRequest) => {
  const key = DRAFT_BOOKING_KEY(userId);
  localStorage.setItem(key, JSON.stringify(payload));
};

const clearDraftBooking = (userId: string) => {
  const key = DRAFT_BOOKING_KEY(userId);
  localStorage.removeItem(key);
};

const getPendingBookingId = (userId: string) => {
  return localStorage.getItem(PENDING_BOOKING_KEY(userId));
};

const setPendingBookingId = (userId: string, bookingId: string) => {
  localStorage.setItem(PENDING_BOOKING_KEY(userId), bookingId);
};

const BookingCardView: React.FC<BookingCardViewProps> = ({
  tourId,
  departure_location,
  price,
  childPrice,
  finalPrice,
  finalChildPrice,
  hasDiscount = false,
}) => {
  const router = useRouter();
  const { createBooking } = useBookingService();

  const { user } = useAuth();
  const userId = user?.user_id;

  const { openLoginModal } = useLoginModal();
  const [travelDate, setTravelDate] = useState("");
  const [numAdults, setNumAdults] = useState(2);
  const [numChildren, setNumChildren] = useState(0);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const adultUnitPrice = hasDiscount ? finalPrice : price;
  console.log(adultUnitPrice);
  const childUnitPrice = hasDiscount ? finalChildPrice : childPrice;
  console.log(childUnitPrice);
  // Tính tổng tiền
  const total = useMemo(() => {
    const adults = Number(numAdults);
    const children = Number(numChildren);

    return adults * Number(adultUnitPrice) + children * Number(childUnitPrice);
  }, [numAdults, numChildren, adultUnitPrice, childUnitPrice]);
  console.log(total);

  const departureText =
    (departure_location ?? "").trim() || "Chưa có thông tin";

  // loadDraft
  useEffect(() => {
    if (!userId) return;
    const draft = loadDraftBooking(tourId, userId);
    if (!draft) return;
    setTravelDate(draft.travel_date || "");
    setNumAdults(draft.num_adults ?? 2);
    setNumChildren(draft.num_children ?? 0);
    setNote(draft.note || "");
  }, [tourId, userId]);

  // Validate trước khi tạo booking
  const validateBeforeBooking = useCallback(() => {
    if (!travelDate) {
      toast.warning("Vui lòng chọn ngày khởi hành");
      return false;
    }

    if (numAdults < 1) {
      toast.warning("Số người lớn phải >= 1");
      return false;
    }
    return true;
  }, [travelDate, numAdults]);

  // hàm xử lý nút đặt tour
  const handleBookingClick = () => {
    if (isSubmitting) return;
    if (!user || !userId) {
      toast.warning("Bạn cần đăng nhập để đặt tour");
      openLoginModal();
      return;
    }

    const pendingBookingId = getPendingBookingId(userId);
    if (pendingBookingId) {
      toast("Bạn đang có đơn chưa hoàn tất. Chuyển đến trang thanh toán");
      router.push(`/dashboard/orders/${pendingBookingId}`);
      return;
    }

    if (!validateBeforeBooking()) return;
    setShowConfirm(true);
  };

  // hàm xử lý confirm Booking
  const handleConfirmBooking = async () => {
    setShowConfirm(false);

    if (!userId) {
      toast.warning("Bạn cần đăng nhập để đặt tour");
      openLoginModal();
      return;
    }

    const payload: CreateBookingRequest = {
      tour: tourId,
      travel_date: travelDate,
      num_adults: numAdults,
      num_children: numChildren,
      note: note?.trim() || undefined,
    };

    // Lưu draft trước khi gọi API
    saveDraftBooking(userId, payload);
    setIsSubmitting(true);

    try {
      const res = await createBooking(payload);
      console.log("API create Booking response: ", res);

      if (!res.success) {
        toast.error(res.error?.message || "Không thể tạo booking");
        return;
      }

      const bookingId = res.data?.booking_id;
      if (!bookingId) {
        toast.error("Có lỗi xảy ra, thiếu mã booking");
        return;
      }

      // Có booking thành công không cần giữ draft form nữa
      clearDraftBooking(userId);
      setPendingBookingId(userId, bookingId);
      router.push(`/dashboard/orders/${bookingId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="sticky top-6">
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Header giá */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] text-gray-500">Giá từ</div>

              <div className="mt-1 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(price)}
                    </span>
                  )}
                  <span className="text-2xl font-extrabold text-gray-900">
                    {formatPrice(adultUnitPrice)}
                  </span>
                  <span className="text-[11px] text-gray-500">/ người lớn</span>
                </div>

                <div className="flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-[11px] text-gray-400 line-through">
                      {formatPrice(childPrice)}
                    </span>
                  )}
                  <span className="text-base font-semibold text-gray-900">
                    {formatPrice(childUnitPrice)}
                  </span>
                  <span className="text-[11px] text-gray-500">/ trẻ em</span>
                </div>
              </div>
            </div>

            {hasDiscount && (
              <div className="inline-flex items-center gap-1 rounded-full bg-red-600/90 text-white px-2.5 py-1 text-[11px] font-semibold">
                <Tag className="w-3.5 h-3.5" />
                Ưu đãi
              </div>
            )}
          </div>

          {/* Điểm khởi hành */}
          <div className="rounded-xl border p-3 bg-slate-50">
            <div className="text-[11px] text-gray-500">Điểm khởi hành</div>
            <div className="text-sm font-semibold text-gray-900">
              {departureText}
            </div>
            <p className="mt-1 text-[11px] text-gray-500 leading-relaxed">
              Tự túc đến điểm khởi hành. Đại lý sẽ liên hệ xác nhận sau khi đặt.
            </p>
          </div>

          {/* Ngày + số lượng */}
          <div className="space-y-3">
            {/* Ngày khởi hành */}
            <div className="space-y-1">
              <label className="block text-[12px] text-gray-600">
                Ngày khởi hành
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full rounded-lg border pl-9 pr-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            {/* Người lớn + Trẻ em  */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border p-3">
                <div className="text-[12px] text-gray-600">
                  Người lớn{" "}
                  <span className="text-[10px] text-gray-400">(≥ 12)</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setNumAdults((v) => clamp(v - 1, 1, 50))}
                    className="h-8 w-8 rounded-lg border hover:bg-slate-50"
                    aria-label="Giảm người lớn"
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>

                  <div className="text-base font-semibold">{numAdults}</div>

                  <button
                    type="button"
                    onClick={() => setNumAdults((v) => clamp(v + 1, 1, 50))}
                    className="h-8 w-8 rounded-lg border hover:bg-slate-50"
                    aria-label="Tăng người lớn"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border p-3">
                <div className="text-[12px] text-gray-600">
                  Trẻ em{" "}
                  <span className="text-[10px] text-gray-400">(2–11)</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setNumChildren((v) => clamp(v - 1, 0, 50))}
                    className="h-8 w-8 rounded-lg border hover:bg-slate-50"
                    aria-label="Giảm trẻ em"
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>

                  <div className="text-base font-semibold">{numChildren}</div>

                  <button
                    type="button"
                    onClick={() => setNumChildren((v) => clamp(v + 1, 0, 50))}
                    className="h-8 w-8 rounded-lg border hover:bg-slate-50"
                    aria-label="Tăng trẻ em"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ghi chú  */}
          <div className="space-y-1">
            <label className="block text-[12px] text-gray-600">
              Ghi chú (tuỳ chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full min-h-[56px] rounded-lg border px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Ví dụ: cần hỗ trợ di chuyển..."
            />
          </div>

          {/* Tổng tiền */}
          <div className="rounded-xl border bg-slate-50 p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[12px] text-gray-600">Tạm tính</div>
                <div className="text-[11px] text-gray-500">
                  {numAdults} người lớn • {numChildren} trẻ em
                </div>
              </div>

              <div className="text-base font-extrabold text-gray-900">
                {formatPrice(total)}
              </div>
            </div>
          </div>

          <Button
            className="w-full rounded-lg bg-black text-white py-2.5 text-[13px] font-medium hover:opacity-90"
            onClick={handleBookingClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Đặt tour ngay"}
          </Button>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            Chưa trừ tiền ngay. Đại lý sẽ liên hệ xác nhận và hướng dẫn thanh
            toán.
          </p>
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Xác nhận đặt tour"
        description="Bạn có chắc chắn muốn đặt tour này với các thông tin đã chọn không?"
        onConfirm={handleConfirmBooking}
      />
    </aside>
  );
};

export default BookingCardView;
