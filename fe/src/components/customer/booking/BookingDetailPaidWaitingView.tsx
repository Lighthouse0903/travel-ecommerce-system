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

import MotionFlow, { MotionItem } from "@/components/common/motion/MotionFlow";

interface Props {
  booking: BookingDetail;
}

const BookingDetailPaidWaitingView = ({ booking }: Props) => {
  const router = useRouter();

  return (
    <MotionFlow>
      <div className="space-y-5">
        <MotionItem>
          <BookingDetailHeader
            title={`Chi tiết Đơn hàng #${shortCode(booking.booking_id)}`}
            onBack={() => router.back()}
          />
        </MotionItem>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* LEFT */}
          <div className="space-y-5 lg:col-span-8">
            <MotionItem>
              <BookingStatusBanner booking={booking} />
            </MotionItem>

            <MotionItem>
              <BookingInforTourCard booking={booking} />
            </MotionItem>

            <MotionItem>
              <BookingMetaInforCard booking={booking} />
            </MotionItem>

            <MotionItem>
              <BookingInforCustomerCard booking={booking} />
            </MotionItem>
          </div>

          {/* RIGHT */}
          <div className="space-y-5 lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-5">
              <MotionItem>
                <PaymentSummaryCard
                  booking={booking}
                  onPay={(bookingId) => {
                    router.push(`/checkout/${bookingId}`);
                  }}
                />
              </MotionItem>

              <MotionItem>
                <BookingTimelineCard booking={booking} />
              </MotionItem>
            </div>
          </div>
        </div>
      </div>
    </MotionFlow>
  );
};

export default BookingDetailPaidWaitingView;
