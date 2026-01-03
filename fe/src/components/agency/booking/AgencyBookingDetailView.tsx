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
import MotionFlow, { MotionItem } from "@/components/common/motion/MotionFlow";
import BookingPaymentInfoCard from "@/components/customer/booking/BookingPaymentInforCard";
import BookingDetailHeaderAgency from "./BookingDetailHeaderAgency";

interface Props {
  booking: BookingDetail;
}

const AgencyBookingDetailView = ({ booking }: Props) => {
  const router = useRouter();

  return (
    <MotionFlow>
      <div className="space-y-5">
        <MotionItem>
          <BookingDetailHeaderAgency
            title={`Chi tiết Booking #${shortCode(booking.booking_id)}`}
            onBack={() => router.back()}
          />
        </MotionItem>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* cột trái */}
          <div className="space-y-5 lg:col-span-8">
            <MotionItem>
              <BookingInforTourCard booking={booking} />
            </MotionItem>

            <MotionItem>
              <BookingMetaInforCard booking={booking} />
            </MotionItem>

            {/* chỉ hiện khi đã thanh toán */}
            {booking.status === "paid" && (
              <MotionItem>
                <BookingPaymentInfoCard payment={booking.payment} />
              </MotionItem>
            )}

            <MotionItem>
              <BookingInforCustomerCard booking={booking} />
            </MotionItem>
          </div>

          {/* cột phải */}
          <div className="space-y-5 lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-5">
              <MotionItem>
                <AgencyBookingActionsCard booking={booking} />
              </MotionItem>

              <MotionItem>
                <AgencyBookingTimelineCard booking={booking} />
              </MotionItem>
            </div>
          </div>
        </div>
      </div>
    </MotionFlow>
  );
};

export default AgencyBookingDetailView;
