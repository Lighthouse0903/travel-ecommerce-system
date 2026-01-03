import React from "react";

const SkeletonBox = ({ className }: { className: string }) => (
  <div className={`bg-slate-200/70 animate-pulse rounded-lg ${className}`} />
);

const TourDetailSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl px-3 md:px-6 py-6">
      {/* ===== Header ===== */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-2">
          <SkeletonBox className="h-8 w-64 md:w-96" />
          <SkeletonBox className="h-4 w-48" />
        </div>

        <SkeletonBox className="h-10 w-36 rounded-xl" />
      </div>

      {/* ===== Gallery + Meta ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gallery */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border shadow-sm p-3">
            <SkeletonBox className="h-[320px] w-full rounded-xl" />

            <div className="grid grid-cols-4 gap-2 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBox key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-3">
            <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-3">
              <SkeletonBox className="h-6 w-32" />
              <SkeletonBox className="h-8 w-40" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-3/4" />

              <div className="pt-3">
                <SkeletonBox className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Content sections ===== */}
      <div className="mt-6 space-y-6">
        {/* Description */}
        <section>
          <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-3">
            <SkeletonBox className="h-6 w-40" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-5/6" />
          </div>
        </section>

        {/* Itinerary */}
        <section>
          <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
            <SkeletonBox className="h-6 w-48" />

            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBox className="h-5 w-32" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-11/12" />
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-3">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-5/6" />
            <SkeletonBox className="h-4 w-2/3" />
          </div>
        </section>

        {/* Policy */}
        <section>
          <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-3">
            <SkeletonBox className="h-6 w-40" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-4/5" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TourDetailSkeleton;
