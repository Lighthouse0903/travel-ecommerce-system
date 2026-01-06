import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const BookingTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[260px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-40 rounded-full" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-20 ml-auto" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-24 ml-auto rounded-xl" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default BookingTableSkeleton;
