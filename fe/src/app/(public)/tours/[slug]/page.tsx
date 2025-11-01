import TourFilter from "@/components/customer/tours/TourFilter";
import TourList from "@/components/customer/tours/TourList";
import { notFound } from "next/navigation";

const TOUR_LOCATIONS = {
  sapa: {
    title: "Tour du lịch Sapa",
    description:
      "Khám phá vùng núi Tây Bắc thơ mộng, với những ruộng bậc thang và bản làng yên bình.",
  },
  "ha-giang": {
    title: "Tour du lịch Hà Giang",
    description:
      "Chinh phục đèo Mã Pí Lèng, khám phá cao nguyên đá Đồng Văn và những cung đường đẹp như tranh.",
  },
  "ha-long": {
    title: "Tour du lịch Hạ Long",
    description:
      "Thưởng ngoạn vịnh Hạ Long – kỳ quan thiên nhiên thế giới, với hàng nghìn hòn đảo đá vôi kỳ vĩ.",
  },
};

const TourLocationPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const location = TOUR_LOCATIONS[slug as keyof typeof TOUR_LOCATIONS];
  if (!location) return notFound();
  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="relative w-[90%] lg:w-[85%] xl:w-[80%] flex flex-col md:flex-row justify-between items-start gap-2">
          <div className="w-full md:w-[40%] lg:w-[30%] overflow-hidden">
            <TourFilter />
          </div>
          <div className="w-full md:w-[60%] lg:w-[70%] overflow-hidden">
            <TourList />
          </div>
        </div>
      </div>
    </>
  );
};
export default TourLocationPage;
