"use client";

import { formatPrice } from "@/utils/formatPrice";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingRequest } from "@/types/booking";
import { PickupPoint } from "@/types/tour";
import { useBookingService } from "@/services/bookingService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog";

interface BookingCardProps {
  pickup_points: PickupPoint[];
  price: number;
  originalPrice?: number;
  hasDiscount?: boolean;
  tourId: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  pickup_points,
  price,
  originalPrice,
  hasDiscount,
  tourId,
}) => {
  const router = useRouter();
  const { createBooking } = useBookingService();
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();

  const [date, setDate] = useState("");
  const [numAdult, setNumAdult] = useState(2);
  const [numChildren, setNumChildren] = useState(0);
  const [pickupPoint, setPickupPoint] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const draftStr = localStorage.getItem("draft_booking_form");
    if (!draftStr) return;

    try {
      const draft = JSON.parse(draftStr);

      if (draft.tour_id !== tourId) return;

      setDate(draft.travel_date || "");
      setNumAdult(draft.num_adults || 2);
      setNumChildren(draft.num_children || 0);
      setPickupPoint(draft.pickup_point || "");
    } catch (err) {
      console.error("Draft form parse error:", err);
    }
  }, [tourId]);

  useEffect(() => {
    if (pickup_points.length > 0) {
      if (!pickupPoint) setPickupPoint(pickup_points[0].location);
    }
  }, [pickup_points]);

  const handleBookClick = () => {
    if (!user) {
      toast.warning("Bạn cần đăng nhập để đặt tour");
      openLoginModal();
      return;
    }

    // Nếu đang có booking chưa hoàn tất → chuyển checkout
    const pending = localStorage.getItem("pending_booking");
    if (pending) {
      toast(
        "Bạn đang có đơn đặt tour chưa hoàn tất. Chuyển đến trang thanh toán."
      );
      router.push(`/checkout/${pending}/`);
      return;
    }

    if (!date) {
      toast.warning("Vui lòng chọn ngày khởi hành");
      return;
    }

    if (!pickupPoint) {
      toast.warning("Vui lòng chọn điểm đón");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmBooking = async () => {
    setShowConfirm(false);

    const payload: BookingRequest = {
      tour_id: tourId,
      travel_date: date,
      num_adults: numAdult,
      num_children: numChildren,
      pickup_point: pickupPoint,
    };

    // lưu draft
    localStorage.setItem("draft_booking_form", JSON.stringify(payload));

    setIsSubmitting(true);

    try {
      const res = await createBooking(payload);

      if (res.success) {
        const bookingId = res.data?.booking_id;

        if (bookingId) {
          localStorage.setItem("pending_booking", bookingId);
          router.push(`/checkout/${bookingId}/`);
        }
      } else {
        toast.error(res.error?.message || "Không thể tạo booking");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl shadow-md p-5 h-fit w-full border">
      <div className="text-xs text-gray-500 mb-1">Giá từ</div>

      <div className="flex items-baseline gap-2 mb-4">
        <div className="text-2xl font-semibold text-gray-900">
          {formatPrice(price)}
        </div>
        {hasDiscount && originalPrice && (
          <div className="text-xs text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </div>
        )}
      </div>

      {/* form nhập thông tin dặt tour */}
      <div className="space-y-3 text-sm">
        <div>
          <label className="block text-gray-500 mb-1">Ngày khởi hành</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {pickup_points.length > 0 && (
          <div>
            <label className="block text-gray-500 mb-1">Điểm đón</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={pickupPoint}
              onChange={(e) => setPickupPoint(e.target.value)}
            >
              {pickup_points.map((p, idx) => (
                <option key={idx} value={p.location}>
                  {p.location} ({p.time})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-gray-500 mb-1">
            Người lớn{" "}
            <span className="text-[11px] text-gray-400">(từ 12 tuổi)</span>
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={numAdult}
            onChange={(e) => setNumAdult(Number(e.target.value))}
          >
            <option value={1}>1 người</option>
            <option value={2}>2 người</option>
            <option value={3}>3 người</option>
            <option value={4}>4 người</option>
            <option value={5}>5+ khách</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 mb-1">
            Trẻ em{" "}
            <span className="text-[11px] text-gray-400">(2–11 tuổi)</span>
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={numChildren}
            onChange={(e) => setNumChildren(Number(e.target.value))}
          >
            <option value={0}>0 trẻ em</option>
            <option value={1}>1 trẻ em</option>
            <option value={2}>2 trẻ em</option>
            <option value={3}>3 trẻ em</option>
            <option value={4}>4+ trẻ em</option>
          </select>
        </div>
      </div>

      {/* BUTTON */}
      <Button
        onClick={handleBookClick}
        disabled={isSubmitting}
        className="mt-4 w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Đang xử lý..." : "Đặt tour ngay"}
      </Button>

      <p className="mt-3 text-xs text-gray-500">
        Bạn chưa bị trừ tiền ngay. Chúng tôi sẽ liên hệ xác nhận trong thời gian
        sớm nhất.
      </p>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Xác nhận đặt tour"
        description="Bạn có chắc chắn muốn đặt tour này với các thông tin đã chọn không?"
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default BookingCard;
