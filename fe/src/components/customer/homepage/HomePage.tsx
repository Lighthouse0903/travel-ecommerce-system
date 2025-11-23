"use client";

import Category from "@/components/customer/homepage/Category";
import FavouriteDestination from "@/components/customer/homepage/FavouriteDestination";
import SearchBox from "@/components/customer/homepage/SearchBox";
import TourDisplay from "@/components/customer/homepage/TourDisplay";

import React, { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HomePage = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Tự động chuyển slide
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      // Nếu còn next thì scrollNext, hết thì quay lại slide đầu
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [api]); // <- phụ thuộc vào api, khi setApi xong mới chạy

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero section */}
      <section className="w-full relative overflow-hidden">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="w-full">
            <CarouselItem className="w-full">
              <img
                src="https://i.pinimg.com/736x/97/08/87/970887a4f474da8326213199371c1d0e.jpg"
                className="w-full h-[60vh] md:h-[80vh] object-cover"
                alt=""
              />
            </CarouselItem>
            <CarouselItem className="w-full">
              <img
                src="https://i.pinimg.com/1200x/09/f2/16/09f2169d62927a87aeb5279ca4bfa0c4.jpg"
                className="w-full h-[60vh] md:h-[80vh] object-cover"
                alt=""
              />
            </CarouselItem>
            <CarouselItem className="w-full">
              <img
                src="https://i.pinimg.com/1200x/79/fb/75/79fb7565154e04969f10720622618d32.jpg"
                className="w-full h-[60vh] md:h-[80vh] object-cover"
                alt=""
              />
            </CarouselItem>
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Overlay + searchbox ở chính giữa */}
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
          <div className="text-center flex flex-col items-center px-4">
            <h1 className="text-2xl md:text-5xl font-serif text-white mb-6">
              Khám phá Việt Nam cùng VietTravel
            </h1>

            <p className="text-white text-lg md:text-2xl font-light mb-6">
              Combo khách sạn - vé máy bay - đưa đón sân bay giá tốt nhất!
            </p>

            {/* Search Box */}
            <div className="w-full max-w-[700px]">
              <SearchBox />
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục tour nổi bật */}
      <section className="relative bg-slate-100 flex items-center justify-center">
        <div className="w-[95%] md:w-[90%]">
          <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-xl sm:text-2xl font-semibold mt-8 mb-2">
              Danh mục tour nổi bật
            </h1>
            <p className="text-center text-sm sm:text-base mb-3">
              Khám phá những hành trình được yêu thích nhất cùng Vietravel!
            </p>
          </div>

          <Category />
        </div>
      </section>

      {/* Tour ưu đãi */}
      <section className="relative bg-slate-100 flex items-center justify-center">
        <div className="w-[90%] md:w-[85%]">
          <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-xl sm:text-2xl font-semibold mt-8 mb-2">
              Tour ưu đãi giá hấp dẫn
            </h1>
            <p className="text-center text-sm sm:text-base mb-3">
              Cơ hội tuyệt vời để vi vu khắp Việt Nam!
            </p>
          </div>

          <TourDisplay />
        </div>
      </section>

      {/* Điểm đến yêu thích */}
      <section className="relative bg-slate-100 flex items-center justify-center">
        <div className="w-[95%] md:w-[90%]">
          <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-xl sm:text-2xl font-semibold mt-8 mb-2">
              Điểm đến yêu thích
            </h1>
            <p className="text-center text-sm sm:text-base mb-3">
              Khám phá các điểm đến được yêu thích nhất!
            </p>
          </div>

          <FavouriteDestination />
        </div>
      </section>
    </div>
  );
};
export default HomePage;
