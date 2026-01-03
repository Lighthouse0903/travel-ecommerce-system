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

export type PaymentStatus = "pending" | "processing" | "success" | "failed";

export interface PaymentInfo {
  payment_id: string;
  provider: string; // "momo"
  status: PaymentStatus;
  amount: string;
  transaction_id: string | null; // orderId
  provider_txn: string | null; // transId
  paid_at: string | null;
}
