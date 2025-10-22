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
const TourDisplay = () => {
  const tours = [
    {
      id: 1,
      title: "Du lịch Hà Nội - Ninh Bình - Cát Bà - Hạ Long - Hải Dương",
      image:
        "https://i.pinimg.com/736x/3f/86/65/3f8665f8890e972697b784ad0ba0fbc4.jpg",
      originalPrice: 7500000,
      salePrice: 6400000,
      departureSchedule: "Thứ 2 hằng tuần",
      duration: "4 ngày 3 đêm",
      departurePoint: "Hà Nội",
      destinations: ["Ninh Bình", "Cát Bà", "Hạ Long", "Hải Dương"],
    },
    {
      id: 2,
      title: "Tour Sapa - Fansipan - Bản Cát Cát - Thác Bạc",
      image:
        "https://i.pinimg.com/1200x/27/c0/9e/27c09e88862f79451f9fced4fbb90d9b.jpg",
      originalPrice: 6200000,
      salePrice: 5500000,
      departureSchedule: "Thứ 5 hằng tuần",
      duration: "3 ngày 2 đêm",
      departurePoint: "Hà Nội",
      destinations: ["Sapa", "Fansipan", "Bản Cát Cát"],
    },
    {
      id: 3,
      title: "Tour Đà Nẵng - Hội An - Bà Nà Hills - Cù Lao Chàm",
      image:
        "https://i.pinimg.com/736x/3e/15/25/3e1525d05a8fb1592cd0e01e90a6d4cc.jpg",
      originalPrice: 8900000,
      salePrice: 7900000,
      departureSchedule: "Thứ 6 hằng tuần",
      duration: "5 ngày 4 đêm",
      departurePoint: "TP. Hồ Chí Minh",
      destinations: ["Đà Nẵng", "Hội An", "Bà Nà Hills", "Cù Lao Chàm"],
    },
    {
      id: 4,
      title: "Tour Phú Quốc - Nam Đảo - Hòn Thơm - Cáp treo vượt biển",
      image:
        "https://i.pinimg.com/1200x/ff/8d/c1/ff8dc1ecb5269399e00033fbc92e934c.jpg",
      originalPrice: 9500000,
      salePrice: 8600000,
      departureSchedule: "Thứ 7 hằng tuần",
      duration: "4 ngày 3 đêm",
      departurePoint: "Hà Nội",
      destinations: ["Phú Quốc", "Nam Đảo", "Hòn Thơm"],
    },
    {
      id: 5,
      title: "Du lịch Nha Trang - Đảo Bình Ba - Vịnh Vân Phong",
      image:
        "https://i.pinimg.com/1200x/a8/8a/75/a88a75504a1e0083bf39f9bac8cd7e3a.jpg",
      originalPrice: 8200000,
      salePrice: 7200000,
      departureSchedule: "Thứ 4 hằng tuần",
      duration: "4 ngày 3 đêm",
      departurePoint: "TP. Hồ Chí Minh",
      destinations: ["Nha Trang", "Bình Ba", "Vân Phong"],
    },
    {
      id: 6,
      title: "Tour Đà Lạt - Thung lũng Tình Yêu - Langbiang - Hồ Xuân Hương",
      image:
        "https://i.pinimg.com/1200x/a3/6e/68/a36e6875ed7b9df84a63e75fa7fbaf9d.jpg",
      originalPrice: 6800000,
      salePrice: 5900000,
      departureSchedule: "Thứ 6 hằng tuần",
      duration: "3 ngày 2 đêm",
      departurePoint: "TP. Hồ Chí Minh",
      destinations: ["Đà Lạt", "Langbiang", "Thung lũng Tình Yêu"],
    },
    {
      id: 7,
      title: "Tour Miền Tây - Cần Thơ - Chợ nổi Cái Răng - Mỹ Tho",
      image:
        "https://i.pinimg.com/736x/c4/2c/44/c42c448bdb2b9869a7d05bbff3a5ee46.jpg",
      originalPrice: 5600000,
      salePrice: 4800000,
      departureSchedule: "Chủ nhật hằng tuần",
      duration: "2 ngày 1 đêm",
      departurePoint: "TP. Hồ Chí Minh",
      destinations: ["Cần Thơ", "Mỹ Tho"],
    },
    {
      id: 8,
      title: "Tour Huế - Đại Nội - Lăng Khải Định - Chùa Thiên Mụ",
      image:
        "https://i.pinimg.com/736x/8f/ad/50/8fad50afbe65a2c7193eb132359b327f.jpg",
      originalPrice: 7000000,
      salePrice: 6100000,
      departureSchedule: "Thứ 3 hằng tuần",
      duration: "3 ngày 2 đêm",
      departurePoint: "Đà Nẵng",
      destinations: ["Huế", "Đại Nội", "Chùa Thiên Mụ"],
    },
    {
      id: 9,
      title:
        "Tour Quảng Bình - Động Phong Nha - Thiên Đường - Sông Chày Hang Tối",
      image:
        "https://i.pinimg.com/1200x/49/80/45/49804570ae2589a60ea56b11699bb2e5.jpg",
      originalPrice: 7800000,
      salePrice: 6900000,
      departureSchedule: "Thứ 5 hằng tuần",
      duration: "4 ngày 3 đêm",
      departurePoint: "Hà Nội",
      destinations: ["Phong Nha", "Thiên Đường", "Sông Chày Hang Tối"],
    },
  ];

  return (
    <>
      <div className="flex justify-center items-center bg-slate-100">
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {tours.map((tour) => (
              <CarouselItem
                key={tour.id}
                className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col aspect-[3/4] items-center justify-center p-2 sm:p-4">
                      <div className="w-full h-[55%] sm:h-[50%] lg:h-[45%] rounded-lg overflow-hidden">
                        <img
                          src={tour.image}
                          alt="Ảnh"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-[13px] sm:text-[16px] md:text-[19px] font-semibold mb-2 leading-tight line-clamp-2 break-words">
                            {tour.title}
                          </h3>

                          <div className="text-sm text-slate-600 space-y-1 mb-3">
                            <div className="flex items-center gap-x-1">
                              <SlCalender />
                              <p className="hidden md:flex">Lịch khởi hành:</p>
                              <p>{tour.departureSchedule}</p>
                            </div>
                            <div className="flex items-center gap-x-1">
                              <TbClockHour1 />
                              <p className="hidden md:flex">Thời gian:</p>
                              <p>{tour.duration}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-slate-400 line-through text-sm">
                                {tour.originalPrice.toLocaleString("vi-VN")}đ
                              </p>
                              <p className="text-slate-600 text-xl font-bold">
                                {tour.salePrice.toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                            <Button className="bg-slate-500 hover:bg-slate-700 text-white">
                              Đặt tour
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
};
export default TourDisplay;
