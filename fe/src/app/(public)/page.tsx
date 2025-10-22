"use client";

import Category from "@/components/customer/homepage/Category";
import SearchBox from "@/components/customer/homepage/SearchBox";
import TourDisplay from "@/components/customer/homepage/TourDisplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { GoSearch } from "react-icons/go";

export default function Home() {
  return (
    <div>
      {/* Section 1: Header Carousel */}
      <section className="w-full flex items-center justify-center bg-slate-100">
        <div className="w-[90%] sm:w-[80%] relative mt-[10px]">
          <Carousel>
            <CarouselContent>
              <CarouselItem className="relative w-full">
                <img
                  src="https://i.pinimg.com/736x/97/08/87/970887a4f474da8326213199371c1d0e.jpg"
                  alt="Khám phá Việt Nam"
                  className="w-full h-[50vh] md:h-[70vh] object-cover rounded-2xl shadow-lg"
                />
              </CarouselItem>
              <CarouselItem className="relative w-full">
                <img
                  src="https://i.pinimg.com/1200x/09/f2/16/09f2169d62927a87aeb5279ca4bfa0c4.jpg"
                  alt="Khám phá Việt Nam"
                  className="w-full h-[50vh] md:h-[70vh] object-cover rounded-2xl shadow-lg"
                />
              </CarouselItem>
              <CarouselItem className="relative w-full">
                <img
                  src="https://i.pinimg.com/1200x/79/fb/75/79fb7565154e04969f10720622618d32.jpg"
                  alt="Khám phá Việt Nam"
                  className="w-full h-[50vh] md:h-[70vh] object-cover rounded-2xl shadow-lg"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="absolute inset-0 bg-black/40 flex justify-center items-center rounded-2xl">
            <div className="flex flex-col items-center justify-center w-[90vw] md:w-[80vw] h-auto px-4">
              <h1 className="text-xl sm:text-3xl md:text-[50px] font-serif text-center text-white mb-7">
                Khám phá Việt Nam cùng VietTravel
              </h1>
              <div className="w-full text-white text-center md:text-left">
                <h2 className="text-lg sm:text-xl md:text-[25px] font-serif  mb-1 ml-[210px] hidden xl:inline">
                  Trải nghiệm kỳ nghỉ tuyệt vời
                </h2>
                <h3 className="text-sm sm:text-lg font-serif mb-0 ml-[210px] hidden 2xl:flex">
                  Combo khách sạn - vé máy bay - đưa đón sân bay giá tốt nhất
                </h3>
              </div>

              {/* ô nhập thông tin tìm kiếm tour: Địa điểm, ngân sách */}
              <SearchBox />
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục tour nổi bật */}
      <section className="relative bg-slate-100 flex items-center justify-center">
        <div className="w-[90%] md:w-[80%]">
          <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-xl sm:text-2xl font-semibold mt-8 mb-2">
              Danh mục tour nổi bật
            </h1>
            <p className="text-center text-sm sm:text-base mb-3">
              Khám phá những hành trình được yêu thích nhất cùng Vietravel - nơi
              mỗi chuyến đi đều mang đến trải nghiệm đáng nhớ!
            </p>
          </div>
          <Category />
        </div>
      </section>

      {/* Tour ưu đãi  */}
      <section className="relative bg-slate-100 flex items-center justify-center">
        <div className="w-[90%] md:w-[80%]">
          <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-xl sm:text-2xl font-semibold mt-8 mb-2">
              Tour ưu đãi giá hấp dẫn
            </h1>
            <p className="text-center text-sm sm:text-base mb-3">
              Cùng Vietravel khám phá những hành trình trong nước với mức giá
              siêu ưu đãi - cơ hội tuyệt vời để vi vu khắp Việt Nam!
            </p>
          </div>
          <TourDisplay />
        </div>
      </section>

      <section className="relative bg-slate-100 flex items-center justify-center">
        <div className="w-[90%] md:w-[80%]">
          <h1 className="text-center text-xl sm:text-2xl font-semibold mt-8 mb-7">
            Điểm đến yêu thích
          </h1>
        </div>
      </section>
    </div>
  );
}
