"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import TourCard from "./TourCard";
import { useTourService } from "@/services/tourService";
import { TourListPageType } from "@/types/tour";

interface TourListProps {
  initialCategory?: string; // code: "sea" | "mountain" | ...
}

const TourList: React.FC<TourListProps> = ({ initialCategory }) => {
  const { getListPublicTour } = useTourService();
  const searchParams = useSearchParams();

  const [tours, setTours] = useState<TourListPageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Lấy filter từ URL (?destination=...&categories=...&...)
  const destination = searchParams.get("destination") || "";
  const durationDays = searchParams.get("duration_days") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const startLocation = searchParams.get("start_location") || "";
  const endLocation = searchParams.get("end_location") || "";
  const categoriesFromUrl = searchParams.get("categories") || "";
  const region = searchParams.get("region") || "";

  // Ưu tiên categories trên URL, nếu không có thì dùng initialCategory (từ slug)
  const effectiveCategories = categoriesFromUrl || initialCategory || "";

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);

        const query: Record<string, string> = {};

        if (destination) query.destination = destination;
        if (durationDays) query.duration_days = durationDays;
        if (minPrice) query.min_price = minPrice;
        if (maxPrice) query.max_price = maxPrice;
        if (startLocation) query.start_location = startLocation;
        if (endLocation) query.end_location = endLocation;
        if (effectiveCategories) query.categories = effectiveCategories;
        if (region) query.region = region;

        console.log("Query: ", query);

        const res = await getListPublicTour(query);

        if (res.success) {
          setTours((res.data ?? []) as TourListPageType[]);
        } else {
          console.warn("Lỗi khi lấy danh sách tour Public");
          setTours([]);
        }
      } catch (error) {
        console.error("Lỗi Server khi lấy danh sách tour: ", error);
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [
    destination,
    durationDays,
    minPrice,
    maxPrice,
    startLocation,
    endLocation,
    effectiveCategories,
    region,
  ]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-56 rounded-xl bg-slate-200 animate-pulse"
          />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {tours.map((tour) => (
        <TourCard key={tour.tour_id} {...tour} />
      ))}
    </div>
  );
};

export default TourList;
