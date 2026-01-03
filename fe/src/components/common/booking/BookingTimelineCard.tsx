"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { BookingDetail } from "@/types/booking";
import { formatDateTime } from "@/utils/formatDate";

type Item = {
  label: string;
  time: string;
  active?: boolean;
  tone?: "neutral" | "success" | "danger";
};

interface Props {
  booking: BookingDetail;
}

const BookingTimelineCard = ({ booking }: Props) => {
  const items: Item[] = [];

  items.push({
    label: "Đặt tour thành công",
    time: formatDateTime(booking.booking_date),
    active: true,
    tone: "success",
  });

  if (booking.approved_at) {
    items.push({
      label: "Đã xác nhận",
      time: formatDateTime(booking.approved_at),
      active: true,
      tone: "success",
    });
  }

  if (booking.paid_at) {
    items.push({
      label: "Đã thanh toán",
      time: formatDateTime(booking.paid_at),
      active: true,
      tone: "success",
    });
  }

  if (booking.rejected_at) {
    items.push({
      label: "Đơn hàng bị từ chối",
      time: formatDateTime(booking.rejected_at),
      active: true,
      tone: "danger",
    });
  }

  return (
    <Card className="p-5">
      <div className="mb-4 font-semibold">Lịch sử trạng thái</div>

      <div className="space-y-4">
        {items.map((it, idx) => (
          <TimelineRow key={idx} item={it} last={idx === items.length - 1} />
        ))}
      </div>
    </Card>
  );
};
export default BookingTimelineCard;

function TimelineRow({ item, last }: { item: Item; last: boolean }) {
  const dotClass =
    item.tone === "danger"
      ? "bg-red-600"
      : item.tone === "success"
      ? "bg-green-600"
      : "bg-gray-400";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
        {!last && <div className="mt-1 h-full w-px bg-border" />}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{item.time}</div>
        <div className="text-sm font-medium">{item.label}</div>
      </div>
    </div>
  );
}
