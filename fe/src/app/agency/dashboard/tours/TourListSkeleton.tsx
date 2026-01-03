import { Skeleton } from "@/components/ui/skeleton";

const TourListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border bg-white shadow-sm overflow-hidden"
        >
          {/* Thumbnail */}
          <Skeleton className="aspect-[4/3] w-full" />

          <div className="p-4 space-y-3">
            {/* Title */}
            <Skeleton className="h-5 w-3/4" />

            {/* Meta */}
            <div className="flex gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Price */}
            <Skeleton className="h-6 w-1/2" />

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TourListSkeleton;
