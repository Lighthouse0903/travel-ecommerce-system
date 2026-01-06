"use client";

import React from "react";
import { useRouter } from "next/navigation";

import type { BookingDetail } from "@/types/booking";
import BookingInforTourCard from "@/components/common/booking/BookingInforTourCard";
import BookingMetaInforCard from "@/components/common/booking/BookingMetaInforCard";
import BookingInforCustomerCard from "@/components/common/booking/BookingInforCustomerCard";

import AgencyBookingActionsCard from "./AgencyBookingActionsCard";
import AgencyBookingTimelineCard from "./AgencyBookingTimelineCard";
import { shortCode } from "@/utils/formatID";
import BookingPaymentInfoCard from "@/components/customer/booking/BookingPaymentInforCard";
import BookingDetailHeaderAgency from "./BookingDetailHeaderAgency";

interface Props {
  booking: BookingDetail;
}

const AgencyBookingDetailView = ({ booking }: Props) => {
  const router = useRouter();

  return (
    <div className="space-y-5 p-5">
      <BookingDetailHeaderAgency
        title={`Chi tiết Booking #${shortCode(booking.booking_id)}`}
        onBack={() => router.back()}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <BookingInforTourCard booking={booking} />
          <BookingMetaInforCard booking={booking} />

          {booking.status === "paid" && (
            <BookingPaymentInfoCard payment={booking.payment} />
          )}

          <BookingInforCustomerCard booking={booking} />
        </div>

        <div className="space-y-5 lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-5">
            <AgencyBookingActionsCard booking={booking} />
            <AgencyBookingTimelineCard booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyBookingDetailView;
