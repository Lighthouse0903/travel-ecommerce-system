"use client";

import React from "react";
import type { BookingDetail } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { BookingStatus } from "@/types/booking";

const STATUS_UI: Record<
  BookingStatus,
  {
    title: string;
    description: (booking: BookingDetail) => string;
    icon: React.ElementType;
    cardClass: string;
    textClass: string;
  }
> = {
  pending: {
    title: "Đơn hàng đang chờ xác nhận",
    description: () => "Đơn đặt tour của bạn đang được đại lý xem xét.",
    icon: Clock,
    cardClass: "border-amber-200 bg-amber-50",
    textClass: "text-amber-700",
  },

  paid_waiting: {
    title: "Chờ thanh toán",
    description: () =>
      "Đơn hàng đã được xác nhận, vui lòng tiến hành thanh toán.",
    icon: Clock,
    cardClass: "border-sky-200 bg-sky-50",
    textClass: "text-sky-700",
  },

  paid: {
    title: "Đã thanh toán",
    description: () =>
      "Thanh toán thành công. Đơn hàng của bạn đang được chuẩn bị.",
    icon: CheckCircle,
    cardClass: "border-emerald-200 bg-emerald-50",
    textClass: "text-emerald-700",
  },

  rejected: {
    title: "Đơn hàng bị từ chối",
    description: (booking) =>
      booking.rejected_reason?.trim() || "Đơn hàng của bạn đã bị từ chối.",
    icon: XCircle,
    cardClass: "border-red-200 bg-red-50",
    textClass: "text-red-700",
  },
};

interface Props {
  booking: BookingDetail;
}

const BookingStatusBanner = ({ booking }: Props) => {
  const ui = STATUS_UI[booking.status];
  if (!ui) return null;

  const Icon = ui.icon;
  const description = ui.description(booking);

  return (
    <Card className={`${ui.cardClass} p-4`}>
      <div className="flex gap-3">
        <div className="mt-0.5">
          <Icon className={`h-5 w-5 ${ui.textClass}`} />
        </div>
        <div className="space-y-1">
          <div className={`font-semibold ${ui.textClass}`}>{ui.title}</div>
          <div className={`text-sm ${ui.textClass}/90`}>{description}</div>
        </div>
      </div>
    </Card>
  );
};

export default BookingStatusBanner;
