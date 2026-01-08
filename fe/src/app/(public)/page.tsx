import Category from "@/components/customer/homepage/Category";
import FavouriteDestination from "@/components/customer/homepage/FavouriteDestination";
import SearchBox from "@/components/customer/homepage/SearchBox";
import TourDisplay from "@/components/customer/homepage/TourDisplay";
import AiAssistantWidget from "@/components/common/AI/AiAssistantWidget";
import HeroCarousel from "@/components/customer/homepage/HeroCarousel";
import { getListPublicTourService } from "@/services/serverTourService";
import WhyChooseUs from "@/components/customer/homepage/WhyChooseUs";

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
      <Category />

      {/* Tour ưu đãi */}
      <TourDisplay tours={tours} />

      {/* Điểm đến yêu thích */}
      <FavouriteDestination />

      {/* Tại sao lại chọn chúng tôi */}
      <WhyChooseUs />

      <AiAssistantWidget avatarUrl="/images/logo.jpg" />
    </div>
  );
};

export default Home;
