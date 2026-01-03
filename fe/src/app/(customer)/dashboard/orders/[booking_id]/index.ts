import type { BookingStatus, BookingDetail } from "@/types/booking";

import BookingDetailRejectedView from "@/components/customer/booking/BookingDetailRejectedView";
import BookingDetailPendingView from "@/components/customer/booking/BookingDetailPendingView";
import BookingDetailPaidWaitingView from "@/components/customer/booking/BookingDetailPaidWaitingView";

import BookingDetailPaidView from "@/components/customer/booking/BookingDetailPaidView";

export type BookingViewProps = {
  booking: BookingDetail;
};

export const BOOKING_VIEW_BY_STATUS: Partial<
  Record<BookingStatus, React.ComponentType<BookingViewProps>>
> = {
  rejected: BookingDetailRejectedView,
  pending: BookingDetailPendingView,
  paid_waiting: BookingDetailPaidWaitingView,
  paid: BookingDetailPaidView,
};
