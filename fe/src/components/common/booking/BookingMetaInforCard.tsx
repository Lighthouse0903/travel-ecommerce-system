"use client";

import React from "react";

import type { BookingDetail } from "@/types/booking";
import { Card } from "@/components/ui/card";

interface Props {
  booking: BookingDetail;
}

const BOOKING_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ đại lý xác nhận",
  paid_waiting: "Chờ thanh toán",
  paid: "Đã thanh toán",
  rejected: "Bị từ chối",
};

const BookingMetaInforCard = ({ booking }: Props) => {
  return (
    <Card className="p-5 space-y-4">
      <div className="font-semibold">Chi tiết đặt chỗ</div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <MetaBox
          label="Mã đơn hàng"
          value={`#${booking.booking_id.slice(0, 8).toUpperCase()}`}
        />
        <MetaBox
          label="Ngày đặt"
          value={formatDateTime(booking.booking_date)}
        />
        <MetaBox
          label="Ngày khởi hành"
          value={formatDate(booking.travel_date)}
        />
        <MetaBox
          label="Trạng thái"
          value={BOOKING_STATUS_LABEL[booking.status] ?? booking.status}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CountBox label="Người lớn" qty={booking.num_adults} />
        <CountBox label="Trẻ em" qty={booking.num_children} />
      </div>

      <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
        <div className="text-sm font-semibold">Ghi chú</div>
        <div className="mt-1 text-sm text-muted-foreground">
          {booking.note?.trim() ? booking.note : "—"}
        </div>
      </div>
    </Card>
  );
};

export default BookingMetaInforCard;

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        rounded-xl border p-3
        transition-all duration-200
        hover:scale-[1.03]
        hover:bg-slate-50
        hover:border-slate-300
      "
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function CountBox({ label, qty }: { label: string; qty: number }) {
  return (
    <div
      className="
        rounded-xl border p-3
        transition-all duration-200
        hover:scale-[1.02]
        hover:bg-slate-50
        hover:border-slate-300
      "
    >
      <div className="text-xs text-muted-foreground">SỐ LƯỢNG KHÁCH</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="font-medium">{label}</div>
        <div className="text-lg font-semibold">
          {String(qty).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} - ${hh}:${mi}`;
}
