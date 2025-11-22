import { useFetchInstance } from "@/hooks/fetchInstance";
import { ReviewPayload, ReviewResponse } from "@/types/review";
import { ApiResponse } from "@/types/common";
export const useReviewService = () => {
  const { get, post, put, patch, del } = useFetchInstance();

  // hàm gọi API tạo review
  const createReview = (
    payload: ReviewPayload
  ): Promise<ApiResponse<ReviewResponse>> => {
    return post<ReviewResponse>("/reviews/create/", payload, true);
  };

  // hàm gọi API lấy danh sách review của 1 tour
  const getListReviewTour = (
    tour_id: string
  ): Promise<ApiResponse<ReviewResponse[]>> => {
    return get<ReviewResponse[]>(`/reviews/tour/${tour_id}`, false);
  };

  // hàm gọi API cập nhật comment
  const updateReview = (
    review_id: string,
    payload: { comment: string }
  ): Promise<ApiResponse<ReviewResponse>> => {
    return patch<ReviewResponse>(`/reviews/${review_id}/`, payload, true);
  };

  // hàm gọi API xóa comment
  const deleteReview = (
    review_id: string
  ): Promise<ApiResponse<ReviewResponse>> => {
    return del<ReviewResponse>(`/reviews/${review_id}/`, true);
  };
  return { createReview, getListReviewTour, updateReview, deleteReview };
};
