import { Skeleton } from "@/components/ui/skeleton";

const AgencyProfileSkeleton = () => {
  return (
    <div className="flex-1 w-full rounded-xl bg-background p-6 space-y-6">
      {/* Header card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>

          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      {/* 2x2 cards */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-44" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>

        {/* Documents wide */}
        <div className="md:col-span-2 rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgencyProfileSkeleton;
