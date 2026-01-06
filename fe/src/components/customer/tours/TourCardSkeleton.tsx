import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TourCardSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-xl border-border bg-card">
      {/* Image */}
      <div className="relative aspect-[16/9]">
        <Skeleton className="absolute inset-0" />

        {/* discount badge placeholder */}
        <div className="absolute top-3 left-3 z-10">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* duration badge placeholder */}
        <div className="absolute bottom-3 left-3 z-10">
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>
      </div>

      <CardContent className="p-4 flex flex-col min-h-[220px]">
        {/* Title */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Route */}
        <Skeleton className="h-3 w-[80%] mb-4" />

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        {/* Bottom: price + button */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>

          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};
export default TourCardSkeleton;
