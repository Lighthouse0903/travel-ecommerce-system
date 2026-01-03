"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TourCard from "../tours/TourCard";
import type { TourListPageType } from "@/types/tour";

interface TourDisplayProps {
  tours: TourListPageType[];
}

const TourDisplay: React.FC<TourDisplayProps> = ({ tours }) => {
  const hasTours = tours && tours.length > 0;

  return (
    <div className="bg-slate-100">
      <div className="py-6">
        <Carousel className="w-full">
          {/* padding-bottom để shadow không bị cắt */}
          <CarouselContent className="-ml-1 pb-12 pt-2">
            {!hasTours
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CarouselItem
                    key={i}
                    className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="bg-white rounded-xl h-[360px] animate-pulse" />
                  </CarouselItem>
                ))
              : tours.map((tour, idx) => (
                  <CarouselItem
                    key={tour.tour_id ?? idx}
                    className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    {/*  không bọc translate nữa */}
                    <TourCard tour={tour} />
                  </CarouselItem>
                ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default TourDisplay;
