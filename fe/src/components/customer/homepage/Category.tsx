import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Category = () => {
  const tours = [
    {
      src: "https://i.pinimg.com/1200x/34/0f/c7/340fc799d2c8a9421e65bcf114fb3994.jpg",
      title: "Biển Đảo",
    },
    {
      src: "https://i.pinimg.com/736x/65/fd/99/65fd9902f7ba4a0db13d608c491f8cb0.jpg",
      title: "Núi rừng",
    },
    {
      src: "https://i.pinimg.com/1200x/d7/3a/7f/d73a7f4225944538b3a7868c7bdc1b81.jpg",
      title: "Văn hóa, lịch sử",
    },
    {
      src: "https://i.pinimg.com/736x/03/cd/e0/03cde06da030814f584d92bfb14b7002.jpg",
      title: "Du lịch sinh thái",
    },
  ];

  return (
    <div className="bg-slate-100 py-6">
      <Carousel className="w-full max-w-7xl mx-auto">
        <CarouselContent className="-ml-1">
          {tours.map((item, index) => (
            <CarouselItem
              key={index}
              className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Card>
                <CardContent className="relative w-full p-0 aspect-[4/3] rounded-[6px] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover rounded-[6px]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <h2 className="text-gray-100 text-lg sm:text-xl font-semibold">
                      {item.title}
                    </h2>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Category;
