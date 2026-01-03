"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent className="w-full">
        {/* Slide 1 */}
        <CarouselItem className="relative w-full h-[60vh] md:h-[80vh]">
          <Image
            src="https://i.pinimg.com/736x/97/08/87/970887a4f474da8326213199371c1d0e.jpg"
            alt="Ảnh 1"
            fill
            priority
            className="object-cover"
          />
        </CarouselItem>

        {/* Slide 2 */}
        <CarouselItem className="relative w-full h-[60vh] md:h-[80vh]">
          <Image
            src="https://i.pinimg.com/1200x/09/f2/16/09f2169d62927a87aeb5279ca4bfa0c4.jpg"
            alt="Ảnh 2"
            fill
            priority
            className="object-cover"
          />
        </CarouselItem>

        {/* Slide 3 */}
        <CarouselItem className="relative w-full h-[60vh] md:h-[80vh]">
          <Image
            src="https://i.pinimg.com/1200x/79/fb/75/79fb7565154e04969f10720622618d32.jpg"
            alt="Ảnh 3"
            fill
            priority
            className="object-cover"
          />
        </CarouselItem>
      </CarouselContent>

      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default HeroCarousel;
