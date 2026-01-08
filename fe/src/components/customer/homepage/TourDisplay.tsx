"use client";

import React from "react";

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
  const hasTours = Array.isArray(tours) && tours.length > 0;

  return (
    <section className="relative bg-background flex items-center justify-center">
      <div className="w-[90%] md:w-[85%]">
        {/* ===== Heading ===== */}
        <div className="flex flex-col items-center p-2">
          <h2 className="text-center text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-2">
            Tour ưu đãi giá hấp dẫn
          </h2>

          <p className="text-center text-sm sm:text-base text-muted-foreground mb-3">
            Cơ hội tuyệt vời để vi vu khắp Việt Nam!
          </p>
        </div>

        {/* Carousel*/}
        <div className="bg-transparent py-6">
          <Carousel className="w-full">
            {/* padding-bottom để shadow không bị cắt */}
            <CarouselContent className="-ml-1 pb-12 pt-2">
              {!hasTours
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <div className="bg-card border border-border rounded-xl h-[360px] animate-pulse" />
                    </CarouselItem>
                  ))
                : tours.map((tour, idx) => (
                    <CarouselItem
                      key={tour.tour_id ?? idx}
                      className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <TourCard tour={tour} />
                    </CarouselItem>
                  ))}
            </CarouselContent>

            <CarouselPrevious className="bg-card border-border text-foreground opacity-80 hover:opacity-100 transition" />
            <CarouselNext className="bg-card border-border text-foreground opacity-80 hover:opacity-100 transition" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TourDisplay;
