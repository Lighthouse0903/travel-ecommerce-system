"use client";

import React from "react";
import type { BookingDetail } from "@/types/booking";
import { Card } from "@/components/ui/card";

interface Props {
  booking: BookingDetail;
}

const InfoBox = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
};
const BookingInforCustomerCard = ({ booking }: Props) => {
  const hasAny =
    booking.customer_name || booking.customer_email || booking.customer_phone;

  if (!hasAny) return null;

  return (
    <Card className="p-5 space-y-3">
      <div className="font-semibold">Thông tin khách hàng</div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InfoBox label="Họ tên" value={booking.customer_name || "—"} />
        <InfoBox label="Email" value={booking.customer_email || "—"} />
        <InfoBox label="Số điện thoại" value={booking.customer_phone || "—"} />
      </div>
    </Card>
  );
};
export default BookingInforCustomerCard;
