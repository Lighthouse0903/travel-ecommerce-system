import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="w-full">
      <Card className="border border-slate-200 bg-card shadow-sm">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
          <Skeleton className="h-9 w-40 mt-4" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSkeleton;
