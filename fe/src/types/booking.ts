export interface BookingRequest {
  tour_id: string;
  travel_date: string;
  num_adults: number;
  num_children: number;
  pickup_point?: string;
}

export interface BookingResponse {
  booking_id: string;
  travel_date: string;
  num_adults: number;
  num_children: number;
  total_price: string;
  status: string;
  booking_date: string;
}

export interface BookingCustomer {
  full_name: string;
  email: string;
  phone: string;
  address: string;
}
export type BookingStatus =
  | "pending"
  | "paid_waiting"
  | "confirmed"
  | "cancelled";
export interface BookingDetail {
  booking_id: string;
  status: BookingStatus;
  booking_date: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  customer_phone: string;
  travel_date: string;
  num_adults: number;
  num_children: number;
  pickup_point: string;
  total_price: string;
  review_id: string;
  review_rating: number;
  review_comment: string;

  tour_id: string;
  tour_name: string;
  agency_name: string;
  start_location: string;
  end_location: string;

  adult_price: string;
  children_price: string;
  discount: string | null;

  final_price_per_person: {
    adult: string;
    children: string;
  };

  tour_image: string;
}

export interface BookingListPage {
  booking_id: string;
  customer_name: string;
  travel_date: string;
  tour_name: string;
  status: string;
  total_price: number;
}
