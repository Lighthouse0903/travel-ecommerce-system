"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const SkeletonTourCard: React.FC = () => {
  return (
    <Card className="relative w-full bg-white shadow-md rounded-xl overflow-hidden">
      {/* Ảnh */}
      <div className="relative w-full h-44 bg-gray-200 animate-pulse" />

      {/* Menu hành động */}
      <div className="absolute top-2 right-2 h-8 w-8 rounded-full border bg-white/70 backdrop-blur-sm animate-pulse" />

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />

        {/* Description 2 dòng */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>

        {/* Categories pills */}
        <div className="flex flex-wrap gap-1 pt-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-5 w-16 rounded-full bg-pink-100/70 animate-pulse"
            />
          ))}
        </div>

        {/* Info hàng dưới */}
        <div className="flex justify-between items-center text-sm mt-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-10 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Giá */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonTourCard;

/**
 * Cách dùng trong grid khi loading
 * {isLoading && Array.from({length: 6}).map((_, i) => <SkeletonTourCard key={i} />)}
 */
