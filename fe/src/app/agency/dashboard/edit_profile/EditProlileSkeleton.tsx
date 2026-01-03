import { Skeleton } from "@/components/ui/skeleton";

const EditAgencyProfileSkeleton = () => {
  return (
    <div className="flex-1 w-full rounded-xl bg-white p-6 space-y-6">
      {/* Header */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>

      {/* Grid 1: Avatar + Contact */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-44" />
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2: Bank + About */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};
export default EditAgencyProfileSkeleton;
