"use client";
import { useEffect, useState } from "react";
import TourCard from "./TourCard";
import { useTourService } from "@/services/tourService";
import { TourListPageType } from "@/types/tour";
import { CATEGORY_CHOICES } from "@/types/tour";

const TourList: React.FC = () => {
  const { getListPublicTour } = useTourService();
  const [tours, setTours] = useState<TourListPageType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getListPublicTour();
        if (res.success) {
          console.log("Danh sách tour nhận về: ", res.data);
          setTours((res.data ?? []) as TourListPageType[]);
        } else {
          console.log("Lỗi khi lấy dánh sách tour Public");
        }
      } catch (e) {
        console.log("Lỗi Server: ", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {tours.map((tour) => (
        <TourCard key={tour.tour_id} {...tour} />
      ))}
    </div>
  );
};

export default TourList;
