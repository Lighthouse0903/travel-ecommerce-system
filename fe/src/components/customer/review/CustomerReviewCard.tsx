"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import React, { useMemo, useState } from "react";
import { ReviewPayload } from "@/types/review";

interface CustomerReviewCardProps {
  review_rating: number | null;
  review_comment: string | null;
  booking_id: string;
  onSubmitReview: (payload: ReviewPayload) => Promise<void>;
}

const CustomerReviewCard: React.FC<CustomerReviewCardProps> = ({
  review_rating,
  review_comment,
  booking_id,
  onSubmitReview,
}) => {
  // kiểm tra booking đã có review chưa
  const isReviewed = useMemo(() => {
    return review_rating !== null && review_comment !== null;
  }, [review_comment, review_rating]);

  const [rating, setRating] = useState<number>(review_rating ?? 0);
  const [hovered, setHovered] = useState<number>(0);
  const [comment, setComment] = useState<string>(review_comment ?? "");

  const handleReview = async () => {
    if (isReviewed) return;
    console.log("Thông tin đánh giá: ", {
      "số sao ": { rating },
      "nội dung cmt: ": { comment },
    });
    const payload: ReviewPayload = {
      booking_id: booking_id,
      rating: rating,
      comment: comment,
    };
    console.log("Payload: ", payload);
    await onSubmitReview(payload);
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
                    if (isReviewed) return;
                    setRating(star);
                  }}
                  onMouseEnter={() => !isReviewed && setHovered(star)}
                  onMouseLeave={() => !isReviewed && setHovered(0)}
                  className={
                    "w-7 h-7 cursor-pointer transition " +
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
            disabled={isReviewed}
            className={isReviewed ? "bg-slate-50" : ""}
          />
        </div>

        {/* button gửi đánh giá */}
        <div className="pt-2">
          <Button
            onClick={handleReview}
            className="w-full"
            disabled={isReviewed || rating === 0 || !comment.trim()}
          >
            {isReviewed ? "Bạn đã gửi đánh giá" : "Gửi đánh giá"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerReviewCard;
