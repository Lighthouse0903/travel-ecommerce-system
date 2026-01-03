"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  count?: number;
};

const SidebarChatSkeleton: React.FC<Props> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl">
          {/* Avatar */}
          <Skeleton className="w-[45px] h-[45px] rounded-full" />

          {/* Text lines */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>

          {/* Time */}
          <Skeleton className="h-3 w-8 rounded" />
        </div>
      ))}
    </>
  );
};

export default SidebarChatSkeleton;
