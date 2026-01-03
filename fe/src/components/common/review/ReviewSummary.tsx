"use client";

import React, { useMemo } from "react";
import { Star } from "lucide-react";

import type { ReviewResponse } from "@/types/review";

interface Props {
  reviews: ReviewResponse[];
}

const ReviewSummary: React.FC<Props> = ({ reviews }) => {
  const stats = useMemo(() => {
    const total = reviews.length;
    const count: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let sum = 0;
    reviews.forEach((r) => {
      const rating = Math.min(5, Math.max(1, r.rating));
      count[rating] += 1;
      sum += rating;
    });

    const average = total ? sum / total : 0;

    const percent = (star: number) =>
      total ? Math.round((count[star] / total) * 100) : 0;

    return { total, average, count, percent };
  }, [reviews]);

  return (
    <div className="rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* LEFT: average */}
        <div className="col-span-3 space-y-1">
          <div className="text-4xl font-bold">{stats.average.toFixed(1)}</div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={
                  "w-4 h-4 " +
                  (i <= Math.round(stats.average)
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "stroke-slate-300")
                }
              />
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            {stats.total} đánh giá
          </div>
        </div>

        {/* RIGHT: distribution */}
        <div className="col-span-9 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const p = stats.percent(star);
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="w-4 text-sm">{star}</div>

                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${p}%` }}
                  />
                </div>

                <div className="w-10 text-right text-sm text-muted-foreground">
                  {p}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
