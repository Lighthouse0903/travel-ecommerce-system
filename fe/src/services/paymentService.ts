import { useFetchInstance } from "@/hooks/fetchInstance";

import { ApiResponse } from "@/types/common";
import { PaymentRequest, PaymentResponse } from "@/types/payment";

export const usePaymentService = () => {
  const { get, post, patch, put, del } = useFetchInstance();

  // hàm gọi API create payment
  const createMomoPayment = (
    payload: PaymentRequest
  ): Promise<ApiResponse<PaymentResponse>> => {
    return post<PaymentResponse>(`/payments/init/`, payload, true);
  };

  return { createMomoPayment };
};
