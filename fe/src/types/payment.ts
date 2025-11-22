export interface PaymentRequest {
  booking_id: string;
}

export interface PaymentResponse {
  payment_id: string;
  booking_id: string;
  amount: string;
  status: string;
  pay_url: string;
}
