import { Skeleton } from "@/components/ui/skeleton";

const SectionSkeleton = () => (
  <div className="space-y-4 mb-8">
    <Skeleton className="h-6 w-1/3" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

const EditTourSkeleton = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Basic info */}
      <SectionSkeleton />

      {/* Itinerary */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />

        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>

      {/* Services & price */}
      <SectionSkeleton />

      {/* Policy */}
      <SectionSkeleton />

      {/* Media */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>

      {/* Submit button */}
      <Skeleton className="h-10 w-40" />
    </div>
  );
};

export default EditTourSkeleton;
