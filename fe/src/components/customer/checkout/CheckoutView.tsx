"use client";

import React from "react";
import { useRouter } from "next/navigation";

import type { BookingDetail } from "@/types/booking";
import BookingDetailHeader from "@/components/common/booking/BookingDetailHeader";
import BookingInforTourCard from "@/components/common/booking/BookingInforTourCard";
import BookingMetaInforCard from "@/components/common/booking/BookingMetaInforCard";
import BookingInforCustomerCard from "@/components/common/booking/BookingInforCustomerCard";
import BookingTimelineCard from "@/components/common/booking/BookingTimelineCard";
import { shortCode } from "@/utils/formatID";

import MotionFlow, { MotionItem } from "@/components/common/motion/MotionFlow";
import CheckoutPaymentActionCard from "./CheckoutPaymentActionCard";
import PaymentMethodCard from "../booking/PaymentMethodCard";

interface Props {
  booking: BookingDetail;
}

export default function CheckoutView({ booking }: Props) {
  const router = useRouter();

  return (
    <MotionFlow>
      <div className="space-y-5 w-[95%] md:w-[90%] mx-auto">
        <MotionItem>
          <BookingDetailHeader
            title={`Thanh toán Đơn hàng #${shortCode(booking.booking_id)}`}
            onBack={() => router.back()}
          />
        </MotionItem>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <MotionItem>
              <BookingInforTourCard booking={booking} />
            </MotionItem>

            <MotionItem>
              <BookingMetaInforCard booking={booking} />
            </MotionItem>

            <MotionItem>
              <BookingInforCustomerCard booking={booking} />
            </MotionItem>

            <MotionItem>
              <BookingTimelineCard booking={booking} />
            </MotionItem>
          </div>

          <div className="space-y-5 lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-5">
              <MotionItem>
                <PaymentMethodCard
                  booking_date={booking.booking_date}
                  status={booking.status}
                />
              </MotionItem>

              <MotionItem>
                <CheckoutPaymentActionCard booking={booking} />
              </MotionItem>
            </div>
          </div>
        </div>
      </div>
    </MotionFlow>
  );
}
