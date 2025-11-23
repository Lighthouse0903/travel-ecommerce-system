import Link from "next/link";
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
  const categories = [
    {
      code: "sea",
      slug: "bien-dao",
      title: "Biển đảo",
      image:
        "https://bvhttdl.mediacdn.vn/291773308735864832/2023/8/18/12-thang-canh-hai-dang-ke-ga-ham-thuan-nam-binh-thuan-2-16923531101191451805052-1692372446338-16923724464142034700674.jpg",
    },
    {
      code: "mountain",
      slug: "nui-rung",
      title: "Núi rừng",
      image: "https://statics.vinpearl.com/rung-viet-nam-12_1673833830.jpg",
    },
    {
      code: "resort",
      slug: "nghi-duong",
      title: "Nghỉ dưỡng",
      image:
        "https://cafefcdn.com/2020/5/28/134687617032216560051683897-1590649877615196938374.jpg",
    },
    {
      code: "adventure",
      slug: "kham-pha",
      title: "Khám phá",
      image:
        "https://wyndham-thanhthuy.com/wp-content/uploads/2024/11/du-lich-kham-pha-1.jpg",
    },
    {
      code: "cultural",
      slug: "van-hoa",
      title: "Văn hoá",
      image: "https://statics.vinpearl.com/du-lich-van-hoa-05_1632312572.jpg",
    },
    {
      code: "history",
      slug: "lich-su",
      title: "Lịch sử",
      image:
        "https://mia.vn/media/uploads/blog-du-lich/di-tich-lich-su-2-1731597445.jpg",
    },
  ];

  return (
    <div className="bg-slate-100 py-10">
      <Carousel
        className="w-full max-w-7xl mx-auto"
        opts={{
          align: "start",
          loop: true, // cho phép loop vô hạn
        }}
      >
        <CarouselContent className="-ml-2">
          {categories.map((item, index) => (
            <CarouselItem
              key={index}
              className="pl-2 basis-1/2 md:basis-1/3 lg:basis-1/4 transition-transform"
            >
              <Link href={`/tours/${item.slug}`}>
                <Card className="rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="relative w-full p-0 aspect-[4/3] rounded-xl overflow-hidden group">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all"></div>

                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-white text-xl font-semibold drop-shadow-lg">
                        {item.title}
                      </h2>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="opacity-70 hover:opacity-100 transition" />
        <CarouselNext className="opacity-70 hover:opacity-100 transition" />
      </Carousel>
    </div>
  );
};

export default Category;
