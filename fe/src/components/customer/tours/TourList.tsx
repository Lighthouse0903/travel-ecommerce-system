"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TourCard from "./TourCard";
import { TourListPageType } from "@/types/tour";
import { usePagination } from "@/hooks/usePagination";
import { PaginationMeta } from "@/types/pagination";
import PaginationCustom from "@/components/common/pagination/Pagination";
import { getListPublicTourService } from "@/services/serverTourService";
import TourCardSkeleton from "./TourCardSkeleton";

interface TourListProps {
  initialCategory?: string;
}

const TourList: React.FC<TourListProps> = ({ initialCategory }) => {
  const searchParams = useSearchParams();

  // pagination logic
  const { page, pageSize, setPage } = usePagination({
    defaultPageSize: 9,
    maxPageSize: 50,
  });

  const [tours, setTours] = useState<TourListPageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const q = searchParams.get("q") || "";
  const destination = searchParams.get("destination") || "";
  const departureLocation = searchParams.get("departure_location") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const categoriesFromUrl =
    searchParams.get("categories") || searchParams.get("category") || "";
  const region = searchParams.get("region") || "";

  const effectiveCategories = categoriesFromUrl || initialCategory || "";

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);

        const query: Record<string, string | number | undefined> = {
          page,
          page_size: pageSize,
        };

        if (q) query.q = q;
        if (destination) query.destination = destination;
        if (departureLocation) query.departure_location = departureLocation;

        if (minPrice) query.min_price = minPrice;
        if (maxPrice) query.max_price = maxPrice;

        if (effectiveCategories) query.categories = effectiveCategories;
        if (region) query.region = region;

        console.log("Query (public tours):", query);

        const res = await getListPublicTourService(query);
        console.log("API getListTourResponse: ", res);
        if (res.data) {
          setTours(res.data ?? []);
          setMeta((res.meta as PaginationMeta) ?? null);
        } else {
          setTours([]);
          setMeta(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [
    q,
    page,
    pageSize,
    destination,
    departureLocation,
    minPrice,
    maxPrice,
    effectiveCategories,
    region,
  ]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <TourCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && tours.length === 0) {
    return (
      <div className="w-full py-8 text-center text-slate-600">
        <p className="mb-2 font-medium">
          Không tìm thấy tour phù hợp với tiêu chí hiện tại.
        </p>
        <p className="text-sm">
          Bạn có thể thay đổi bộ lọc hoặc chọn một chủ đề khác để khám phá thêm.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {tours.map((tour) => (
          <TourCard key={tour.tour_id} tour={tour} />
        ))}
      </div>

      {meta?.total_pages && meta.total_pages > 1 && (
        <div className="w-full mt-10 flex justify-center">
          <PaginationCustom
            page={page}
            totalPages={meta.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default TourList;
