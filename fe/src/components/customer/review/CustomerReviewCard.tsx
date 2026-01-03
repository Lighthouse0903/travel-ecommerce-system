"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import React, { useMemo, useState } from "react";
import { ReviewPayload } from "@/types/review";
import { useReviewAction } from "@/hooks/useReviewAction";

interface CustomerReviewCardProps {
  canReview: boolean;
  review_rating: number | null;
  review_comment: string;
  booking_id: string;
}

const CustomerReviewCard: React.FC<CustomerReviewCardProps> = ({
  canReview,
  review_rating,
  review_comment,
  booking_id,
}) => {
  const isReviewed = useMemo(() => review_rating !== null, [review_rating]);
  const { submitCreateReview } = useReviewAction();
  const [rating, setRating] = useState<number>(review_rating ?? 0);
  const [hovered, setHovered] = useState<number>(0);
  const [comment, setComment] = useState<string>(review_comment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canReview && !isReviewed) {
    return (
      <Card className="shadow-sm border">
        <CardHeader className="pb-4">
          <CardTitle className="text-md font-semibold">
            Đánh giá của tôi
          </CardTitle>
          <span className="text-xs text-slate-500">
            Bạn sẽ có thể đánh giá sau khi đơn được thanh toán (và/hoặc sau khi
            hoàn thành tour).
          </span>
        </CardHeader>
      </Card>
    );
  }

  const disabled = isReviewed || submitting;

  const handleSubmit = async () => {
    if (disabled) return;

    const trimmed = comment.trim();
    if (rating <= 0) {
      setError("Vui lòng chọn số sao đánh giá.");
      return;
    }
    if (!trimmed) {
      setError("Vui lòng nhập bình luận.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload: ReviewPayload = {
      booking_id: booking_id,
      rating: rating,
      comment: trimmed,
    };

    console.log("Payload: ", payload);
    await submitCreateReview(payload);

    setSubmitting(false);
    setHovered(0);
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-4">
        <CardTitle className="text-md font-semibold">
          Đánh giá của tôi
        </CardTitle>
        {isReviewed && (
          <span className="text-xs text-emerald-600">
            Bạn đã gửi đánh giá cho đơn này
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* star rating */}
        <div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hovered >= star || rating >= star;

              return (
                <Star
                  key={star}
                  onClick={() => {
                    if (disabled) return;
                    setRating(star);
                  }}
                  onMouseEnter={() => !disabled && setHovered(star)}
                  onMouseLeave={() => !disabled && setHovered(0)}
                  className={
                    "w-7 h-7 transition " +
                    (disabled ? "cursor-default " : "cursor-pointer ") +
                    (active
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "stroke-slate-300")
                  }
                />
              );
            })}
          </div>

          {rating > 0 && (
            <p className="text-xs text-slate-500 mt-2">
              Bạn đã đánh giá <span className="font-medium">{rating} / 5</span>{" "}
              sao
            </p>
          )}
        </div>

        {/* comment */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Viết bình luận chi tiết</h3>
          <Textarea
            placeholder="Hãy kể cho mọi người nghe về trải nghiệm của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={disabled}
            className={disabled ? "bg-slate-50" : ""}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* button gửi đánh giá */}
        <div className="pt-2">
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={disabled || rating === 0 || !comment.trim()}
          >
            {isReviewed
              ? "Bạn đã gửi đánh giá"
              : submitting
              ? "Đang gửi..."
              : "Gửi đánh giá"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerReviewCard;
