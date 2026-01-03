"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import type { BookingDetail } from "@/types/booking";
import { useBookingService } from "@/services/bookingService";
import CheckoutView from "@/components/customer/checkout/CheckoutView";

export default function CustomerCheckoutPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = useMemo(
    () => (params?.bookingId as string) || "",
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
        console.log("API get detail booking response: ", res);

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

        const data = (res.data ?? null) as BookingDetail | null;
        setBooking(data);

        if (!data) return;

        if (data.paid_at) {
          toast.message("Đơn hàng đã thanh toán.");
          router.replace(`/dashboard/orders/${data.booking_id}`);
          return;
        }

        if (data.status !== "paid_waiting") {
          toast.message("Đơn hàng chưa được xác nhận để thanh toán.");
          router.replace(`/dashboard/orders/${data.booking_id}`);
          return;
        }
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
    return <div className="p-6">Đang tải checkout...</div>;
  }

  if (!booking) {
    return <div className="p-6">Không tìm thấy đơn hàng.</div>;
  }

  return <CheckoutView booking={booking} />;
}
