"use client";

import React from "react";
import Link from "next/link";
import { Eye, CreditCard, CheckCircle2, Clock, XCircle } from "lucide-react";

import type { BookingDetail } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMoneyVND } from "@/utils/formatPrice";

interface Props {
  booking: BookingDetail;
  onPay?: (bookingId: string) => void;
}

const PaymentSummaryCard = ({ booking, onPay }: Props) => {
  return (
    <Card className="p-5 space-y-4">
      <div className="font-semibold">Tổng thanh toán</div>

      <div className="flex items-end justify-between">
        <div className="text-sm text-muted-foreground">Tổng cộng</div>
        <div className="text-2xl font-semibold">
          {formatMoneyVND(booking.total_price)}
        </div>
      </div>

      <div className="space-y-2">
        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={`/tour/${booking.tour_id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Xem Tour gốc
          </Link>
        </Button>

        <PaymentStateBlock booking={booking} onPay={onPay} />
      </div>
    </Card>
  );
};

export default PaymentSummaryCard;

/* ================= Helpers ================= */

function PaymentStateBlock({
  booking,
  onPay,
}: {
  booking: BookingDetail;
  onPay?: (bookingId: string) => void;
}) {
  switch (booking.status) {
    case "pending":
      return (
        <InfoBox tone="amber" icon={<Clock className="h-4 w-4" />}>
          Đơn hàng đang chờ đại lý xác nhận. Bạn sẽ thanh toán sau khi được
          duyệt.
        </InfoBox>
      );

    case "paid_waiting":
      return (
        <div className="space-y-2">
          <InfoBox tone="sky" icon={<CreditCard className="h-4 w-4" />}>
            Đơn hàng đã được xác nhận. Vui lòng thanh toán để hoàn tất đặt tour.
          </InfoBox>

          <Button
            className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
            onClick={() => onPay?.(booking.booking_id)}
          >
            Thanh toán ngay
          </Button>
        </div>
      );

    case "paid":
      return (
        <InfoBox tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />}>
          Đơn hàng đã được thanh toán.
        </InfoBox>
      );

    case "rejected":
      return (
        <InfoBox tone="rose" icon={<XCircle className="h-4 w-4" />}>
          Đơn hàng đã bị từ chối. Bạn có thể chọn tour khác hoặc đặt lại vào
          ngày khác.
        </InfoBox>
      );

    default:
      return null;
  }
}

function InfoBox({
  tone,
  icon,
  children,
}: {
  tone: "amber" | "sky" | "emerald" | "rose";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : tone === "sky"
      ? "border-sky-200 bg-sky-50 text-sky-800"
      : tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className={`rounded-xl border p-3 text-sm ${toneClass}`}>
      <div className="flex gap-2">
        <div className="mt-0.5">{icon}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}
