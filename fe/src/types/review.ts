export interface ReviewPayload {
  booking_id: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  review_id?: string;
  user_id?: string;
  booking_id?: string;
  rating?: number;
  comment?: string;
  created_at?: string;
  customer_name?: string;
}
