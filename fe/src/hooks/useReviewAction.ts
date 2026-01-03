import { useReviewService } from "@/services/reviewService";
import { ReviewPayload } from "@/types/review";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useReviewAction = () => {
  const router = useRouter();
  const { createReview } = useReviewService();

  const submitCreateReview = async (payload: ReviewPayload) => {
    const res = await createReview(payload);
    console.log("API create review response: ", res);

    if (res.success) {
      toast.success(res.message || "Gửi đánh giá thành công");
      router.refresh();
      return true;
    }

    // Xử lý lỗi
    const fieldErrors = res.error?.errors;
    const firstKey = fieldErrors ? Object.keys(fieldErrors)[0] : null;
    const message =
      (firstKey && fieldErrors?.[firstKey]?.[0]) ||
      res.error?.message ||
      res.message ||
      "Thao tác thất bại";

    toast.error(message);
    return false;
  };

  return { submitCreateReview };
};
