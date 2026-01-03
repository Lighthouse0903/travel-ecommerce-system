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

import MotionFlow, { MotionItem } from "@/components/common/motion/MotionFlow";
import BookingPaymentInfoCard from "./BookingPaymentInforCard";

import { useReviewService } from "@/services/reviewService";
import { toast } from "sonner";
import { ReviewPayload } from "@/types/review";

interface Props {
  booking: BookingDetail;
}

const BookingDetailPaidView = ({ booking }: Props) => {
  const router = useRouter();
  const canReview = booking.status === "paid";
  const review_rating = booking.review_rating ?? null;
  const review_comment = booking.review_comment ?? "";

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
          {/* cột trái */}
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

            <MotionItem>
              <CustomerReviewCard
                canReview={canReview}
                booking_id={booking.booking_id}
                review_rating={review_rating}
                review_comment={review_comment}
              />
            </MotionItem>
          </div>

          {/* cột phải */}
          <div className="space-y-5 lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-5">
              <MotionItem>
                <PaymentSummaryCard booking={booking} />
              </MotionItem>

              <MotionItem>
                <BookingTimelineCard booking={booking} />
              </MotionItem>
              <MotionItem>
                {" "}
                {booking.status === "paid" && (
                  <BookingPaymentInfoCard payment={booking.payment} />
                )}
              </MotionItem>
            </div>
          </div>
        </div>
      </div>
    </MotionFlow>
  );
};

export default BookingDetailPaidView;
