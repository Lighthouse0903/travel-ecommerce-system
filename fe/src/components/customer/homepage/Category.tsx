import Link from "next/link";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const Category = () => {
  const categories = [
    {
      code: "sea",
      title: "Biển đảo",
      image:
        "https://bvhttdl.mediacdn.vn/291773308735864832/2023/8/18/12-thang-canh-hai-dang-ke-ga-ham-thuan-nam-binh-thuan-2-16923531101191451805052-1692372446338-16923724464142034700674.jpg",
    },
    {
      code: "mountain",
      title: "Núi rừng",
      image: "https://statics.vinpearl.com/rung-viet-nam-12_1673833830.jpg",
    },
    {
      code: "resort",
      title: "Nghỉ dưỡng",
      image:
        "https://cafefcdn.com/2020/5/28/134687617032216560051683897-1590649877615196938374.jpg",
    },
    {
      code: "adventure",
      title: "Khám phá",
      image:
        "https://wyndham-thanhthuy.com/wp-content/uploads/2024/11/du-lich-kham-pha-1.jpg",
    },
    {
      code: "cultural",
      title: "Văn hoá",
      image: "https://statics.vinpearl.com/du-lich-van-hoa-05_1632312572.jpg",
    },
    {
      code: "history",
      title: "Lịch sử",
      image:
        "https://mia.vn/media/uploads/blog-du-lich/di-tich-lich-su-2-1731597445.jpg",
    },
  ];

  return (
    <section className="relative bg-background flex items-center justify-center">
      <div className="w-[95%] md:w-[90%]">
        {/* Heading */}
        <div className="flex flex-col items-center p-2">
          <h2 className="text-center text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-2">
            Danh mục tour nổi bật
          </h2>

          <p className="text-center text-sm sm:text-base text-muted-foreground mb-3">
            Khám phá những hành trình được yêu thích nhất cùng VietTravel!
          </p>
        </div>

        {/* Carousel */}
        <div className="bg-transparent pb-6">
          <Carousel
            className="w-full max-w-7xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2">
              {categories.map((item) => (
                <CarouselItem
                  key={item.code}
                  className="pl-2 basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link href={`/tours?categories=${item.code}`}>
                    <Card className="rounded-xl border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <CardContent className="relative w-full p-0 aspect-[4/3] rounded-xl overflow-hidden group">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                        <div className="absolute bottom-4 left-4">
                          <h3 className="text-white text-lg md:text-xl font-semibold drop-shadow-lg">
                            {item.title}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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

export default Category;
