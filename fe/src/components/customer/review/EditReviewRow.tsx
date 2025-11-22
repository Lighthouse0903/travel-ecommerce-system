"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReviewResponse } from "@/types/review";

interface EditReviewRowProps {
  review: ReviewResponse;
  onCancel: () => void;
  onSave: (newComment: string) => void;
}

export default function EditReviewRow({
  review,
  onCancel,
  onSave,
}: EditReviewRowProps) {
  const [comment, setComment] = useState(review.comment ?? "");

  return (
    <div className="space-y-2">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[60px]"
      />

      <div className="flex gap-2 rounded-lg">
        <Button
          size="sm"
          className="bg-blue-800 text-white"
          onClick={() => onSave(comment)}
        >
          Lưu
        </Button>

        <Button size="sm" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </div>
  );
}
