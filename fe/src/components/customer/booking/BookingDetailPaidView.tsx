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

import CustomerReviewCard from "../review/CustomerReviewCard";
import { shortCode } from "@/utils/formatID";

import BookingPaymentInfoCard from "./BookingPaymentInforCard";

interface Props {
  booking: BookingDetail;
}

const BookingDetailPaidView = ({ booking }: Props) => {
  const router = useRouter();
  const canReview = booking.status === "paid";
  const review_rating = booking.review_rating ?? null;
  const review_comment = booking.review_comment ?? "";

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

          <CustomerReviewCard
            canReview={canReview}
            booking_id={booking.booking_id}
            review_rating={review_rating}
            review_comment={review_comment}
          />
        </div>

        <div className="space-y-5 lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-5">
            <PaymentSummaryCard booking={booking} />
            <BookingTimelineCard booking={booking} />

            {booking.status === "paid" && (
              <BookingPaymentInfoCard payment={booking.payment} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPaidView;
