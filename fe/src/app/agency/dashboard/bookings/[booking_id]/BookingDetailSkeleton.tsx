import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BookingDetailSkeleton = () => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <Card className="p-4">
        <Skeleton className="h-6 w-1/3" />
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* cột trái */}
        <div className="space-y-5 lg:col-span-8">
          <Card className="p-5 space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </Card>

          <Card className="p-5 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
          </Card>

          <Card className="p-5 space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        </div>

        {/* cột phải */}
        <div className="space-y-5 lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-5">
            <Card className="p-5 space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </Card>

            <Card className="p-5 space-y-3">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailSkeleton;
