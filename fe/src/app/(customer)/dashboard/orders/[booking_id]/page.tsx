"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { useBookingService } from "@/services/bookingService";
import type { BookingDetail } from "@/types/booking";
import { BOOKING_VIEW_BY_STATUS } from ".";
import MotionFlow, { MotionItem } from "@/components/common/motion/MotionFlow";
import BookingDetailSkeleton from "./BookingDetailSkeleton";

export default function CustomerBookingDetailPage() {
  const params = useParams();

  const bookingId = useMemo(
    () => (params?.booking_id as string) || "",
    [params]
  );

  const { getDetailBookingCustomer } = useBookingService();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!bookingId) return;

      setLoading(true);
      try {
        const res = await getDetailBookingCustomer(bookingId);

        if (!mounted) return;

        if (!res.success) {
          toast.error(
            typeof res.message === "string"
              ? res.message
              : "Không lấy được chi tiết booking."
          );
          setBooking(null);
          return;
        }

        setBooking(res.data ?? null);
      } catch {
        toast.error("Lỗi hệ thống, vui lòng thử lại sau.");
        setBooking(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [bookingId]);

  if (loading) {
    return <BookingDetailSkeleton />;
  }

  if (!booking) {
    return (
      <div className="w-full flex justify-center p-6 text-slate-500">
        Không tìm thấy booking.
      </div>
    );
  }

  const BookingView = BOOKING_VIEW_BY_STATUS[booking.status];

  if (!BookingView) {
    return (
      <div className="w-full flex justify-center p-6 text-slate-500">
        Trạng thái booking chưa được hỗ trợ.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center p-4">
      <MotionFlow>
        <MotionItem className="w-full max-w-5xl">
          <BookingView booking={booking} />
        </MotionItem>
      </MotionFlow>
    </div>
  );
}
