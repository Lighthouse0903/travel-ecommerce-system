"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import type { ReviewResponse } from "@/types/review";
import ReviewItemCard from "./ReviewItemCard";
import ReviewSummary from "./ReviewSummary";

import { useReviewService } from "@/services/reviewService";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewListProps {
  tourId: string;
}

const ReviewList = ({ tourId }: ReviewListProps) => {
  const { user } = useAuth();
  const { getListReviewTour, updateReview, deleteReview } = useReviewService();

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchReviews = async () => {
      setLoading(true);
      const res = await getListReviewTour(tourId);

      if (!mounted) return;

      if (!res.success) {
        toast.error(res.message || "Không thể tải đánh giá");
        setReviews([]);
        setLoading(false);
        return;
      }

      setReviews(res.data ?? []);
      setLoading(false);
    };

    fetchReviews();
    return () => {
      mounted = false;
    };
  }, [tourId]);

  const onEdit = async (review_id: string, comment: string) => {
    const res = await updateReview(review_id, { comment });

    if (!res.success) {
      return { success: false, message: res.message };
    }

    setReviews((prev) =>
      prev.map((r) => (r.review_id === review_id ? { ...r, comment } : r))
    );

    return { success: true, message: res.message || "Đã cập nhật" };
  };

  const onDelete = async (review_id: string) => {
    const res = await deleteReview(review_id);

    if (!res.success) {
      return { success: false, message: res.message };
    }
    setReviews((prev) => prev.filter((r) => r.review_id !== review_id));

    return { success: true, message: res.message || "Đã xóa" };
  };

  if (loading)
    return (
      <div className="text-sm text-muted-foreground">Đang tải đánh giá...</div>
    );
  if (!reviews.length)
    return (
      <div className="text-sm text-muted-foreground">Chưa có đánh giá nào.</div>
    );

  return (
    <div className="space-y-3">
      <ReviewSummary reviews={reviews} />

      {reviews.map((rv) => (
        <ReviewItemCard
          key={rv.review_id}
          review={rv}
          currentUserId={user?.user_id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReviewList;
