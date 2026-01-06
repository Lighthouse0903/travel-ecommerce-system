import { PaymentInfo } from "./payment";

export type BookingStatus =
  | "pending" // chờ agency xác nhận
  | "paid_waiting" // chờ thanh toán
  | "paid" // đã thanh toán
  | "rejected";

export interface BookingListItem {
  booking_id: string;
  booking_date: string;
  travel_date: string;

  num_adults: number;
  num_children: number;
  total_price: string;

  status: BookingStatus;

  // tour
  tour_id?: string;
  tour_name: string;

  // customer
  customer_name?: string;
  customer_email?: string;
}

export interface BookingDetail {
  booking_id: string;
  booking_date: string;
  travel_date: string;
  num_adults: number;
  categories: string[];
  num_children: number;
  note?: string | null;
  total_price: string;
  status: BookingStatus;
  // timeline
  approved_at?: string | null;
  paid_at?: string | null;
  rejected_at?: string | null;
  rejected_reason?: string | null;
  // tour
  thumbnail_url: string;
  tour_id: string;
  tour_name: string;
  departure_location: string;
  destination: string;
  // customer
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  review_rating: number | null;
  review_comment: string;
  // payment
  payment?: PaymentInfo | null;
}

export interface CreateBookingRequest {
  tour: string;
  travel_date: string; // YYYY-MM-DD
  num_adults: number;
  num_children: number;
  note?: string;
}
