import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TbClockHour1 } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { useTourService } from "@/services/tourService";
import { TourListPageType } from "@/types/tour";
import { useEffect, useState } from "react";
import TourCard from "../tours/TourCard";

const TourDisplay = () => {
  const { getListPublicTour } = useTourService();
  const [tours, setTours] = useState<TourListPageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const res = await getListPublicTour();

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
  }, []);

  const TourCardSkeleton = () => {
    return (
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden animate-pulse">
        <div className="h-40 sm:h-44 md:h-52 bg-slate-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-6 bg-slate-200 rounded w-24 mt-4"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center bg-slate-100">
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <TourCardSkeleton />
                </CarouselItem>
              ))
            : tours.map((tour, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <TourCard
                    tour_id={tour.tour_id}
                    image_url={tour.image_url}
                    duration_days={tour.duration_days}
                    destination={tour.destination}
                    name={tour.name}
                    categories={tour.categories}
                    adult_price={tour.adult_price}
                    children_price={tour.children_price}
                    discount={tour.discount}
                    rating={tour.rating}
                    reviews_count={tour.reviews_count}
                    description={tour.description}
                  />
                </CarouselItem>
              ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
export default TourDisplay;
