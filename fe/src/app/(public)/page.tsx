import Category from "@/components/customer/homepage/Category";
import FavouriteDestination from "@/components/customer/homepage/FavouriteDestination";
import SearchBox from "@/components/customer/homepage/SearchBox";
import TourDisplay from "@/components/customer/homepage/TourDisplay";
import AiAssistantWidget from "@/components/common/AI/AiAssistantWidget";
import HeroCarousel from "@/components/customer/homepage/HeroCarousel";
import { getListPublicTourService } from "@/services/serverTourService";

const Home = async () => {
  const { data } = await getListPublicTourService();
  const tours = data.slice(0, 10);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero section */}
      <section className="w-full relative overflow-hidden">
        <HeroCarousel />

        {/* Overlay + searchbox ở chính giữa */}
        <div className="absolute inset-0 bg-foreground/40 flex justify-center items-center">
          <div className="text-center flex flex-col items-center px-4">
            <h1 className="text-2xl md:text-5xl font-serif text-white mb-6">
              Khám phá Việt Nam cùng VietTravel
            </h1>

            <p className="text-white/90 text-lg md:text-2xl font-light mb-6">
              Combo khách sạn - vé máy bay - đưa đón sân bay giá tốt nhất!
            </p>

            <div className="w-full max-w-[700px]">
              <SearchBox />
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục tour nổi bật */}
      <section className="relative bg-background flex items-center justify-center">
        <div className="w-[95%] md:w-[90%]">
          <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-2">
              Danh mục tour nổi bật
            </h1>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-3">
              Khám phá những hành trình được yêu thích nhất cùng Vietravel!
            </p>
          </div>
          <Category />
        </div>
      </section>

      {/* Tour ưu đãi */}
      <section className="relative bg-background flex items-center justify-center">
        <div className="w-[90%] md:w-[85%]">
          <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-2">
              Tour ưu đãi giá hấp dẫn
            </h1>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-3">
              Cơ hội tuyệt vời để vi vu khắp Việt Nam!
            </p>
          </div>
          <TourDisplay tours={tours} />
        </div>
      </section>

      {/* Điểm đến yêu thích */}
      <section className="relative bg-background flex items-center justify-center">
        <div className="w-[95%] md:w-[90%]">
          <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-2">
              Điểm đến yêu thích
            </h1>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-3">
              Khám phá các điểm đến được yêu thích nhất!
            </p>
          </div>

          <FavouriteDestination />
        </div>
      </section>

      <AiAssistantWidget avatarUrl="/images/logo.jpg" />
    </div>
  );
};

export default Home;
