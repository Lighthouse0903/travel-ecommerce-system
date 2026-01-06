"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const AgencyBookingListSkeleton = ({ rows = 8 }: { rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16 mt-2" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-48 mt-2" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-52 mt-2" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-7 w-28 rounded-full" />
          </TableCell>

          <TableCell className="text-right">
            <Skeleton className="h-4 w-24 ml-auto" />
          </TableCell>

          <TableCell className="text-right">
            <Skeleton className="h-8 w-24 rounded-xl ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default AgencyBookingListSkeleton;
