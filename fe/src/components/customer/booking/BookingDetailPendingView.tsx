"use client";

import React from "react";
import { useRouter } from "next/navigation";

import type { BookingDetail } from "@/types/booking";
import BookingDetailHeader from "@/components/common/booking/BookingDetailHeader";
import BookingStatusBanner from "@/components/common/booking/BookingStatusBanner";
import BookingInforTourCard from "@/components/common/booking/BookingInforTourCard";
import BookingMetaInforCard from "@/components/common/booking/BookingMetaInforCard";
import BookingInforCustomerCard from "@/components/common/booking/BookingInforCustomerCard";
import PaymentSummaryCard from "@/components/common/booking/PaymentSummaryCard";
import BookingTimelineCard from "@/components/common/booking/BookingTimelineCard";
import { shortCode } from "@/utils/formatID";

interface Props {
  booking: BookingDetail;
}

const BookingDetailPendingView = ({ booking }: Props) => {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <BookingDetailHeader
        title={`Chi tiết Đơn hàng #${shortCode(booking.booking_id)}`}
        onBack={() => router.back()}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <BookingStatusBanner booking={booking} />
          <BookingInforTourCard booking={booking} />
          <BookingMetaInforCard booking={booking} />
          <BookingInforCustomerCard booking={booking} />
        </div>

        <div className="space-y-5 lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-5">
            <PaymentSummaryCard booking={booking} />
            <BookingTimelineCard booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPendingView;
