"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { BookingDetail } from "@/types/booking";
import { formatDateTime } from "@/utils/formatDate";

type Item = {
  label: string;
  time: string;
  tone?: "neutral" | "success" | "danger";
};

interface Props {
  booking: BookingDetail;
}

const TimelineRow = ({ item, last }: { item: Item; last: boolean }) => {
  const dotClass =
    item.tone === "danger"
      ? "bg-rose-600"
      : item.tone === "success"
      ? "bg-emerald-600"
      : "bg-slate-400";

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
};

const AgencyBookingTimelineCard = ({ booking }: Props) => {
  const items: Item[] = [];

  //  Khách tạo đơn
  items.push({
    label: "Khách hàng tạo đơn",
    time: formatDateTime(booking.booking_date),
    tone: "neutral",
  });

  //  Đại lý xác nhận
  if (booking.approved_at) {
    items.push({
      label: "Bạn đã xác nhận đơn",
      time: formatDateTime(booking.approved_at),
      tone: "success",
    });
  }

  //  Khách thanh toán
  if (booking.paid_at) {
    items.push({
      label: "Khách hàng đã thanh toán",
      time: formatDateTime(booking.paid_at),
      tone: "success",
    });
  }

  //  Đại lý từ chối
  if (booking.rejected_at) {
    items.push({
      label: "Bạn đã từ chối đơn",
      time: formatDateTime(booking.rejected_at),
      tone: "danger",
    });
  }

  return (
    <Card className="p-5">
      <div className="mb-4 font-semibold">Lịch sử xử lý đơn</div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <TimelineRow key={idx} item={item} last={idx === items.length - 1} />
        ))}
      </div>
    </Card>
  );
};

export default AgencyBookingTimelineCard;
