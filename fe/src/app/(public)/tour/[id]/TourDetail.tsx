"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useParams } from "next/navigation";
import { useTourService } from "@/services/tourService";

import Gallery from "@/components/common/tours/tour-detail/Gallery";
import Description from "@/components/common/tours/tour-detail/Description";
import Itinerary from "@/components/common/tours/tour-detail/Itinerary";
import Service from "@/components/common/tours/tour-detail/Service";
import PolicyAndGuide from "@/components/common/tours/tour-detail/PolicyAndGuide";
import Sidebar from "@/components/common/tours/tour-detail/Sidebar";

import BookingCard from "@/components/customer/tours/BookingCard";

// shadcn tabs
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TourResponse } from "@/types/tour";
import ListReviewCard from "@/components/common/tours/tour-detail/ListReviewCard";

type SectionKey = "overview" | "itinerary" | "service" | "policy";

const PublicTourDetail: React.FC = () => {
  const { id } = useParams();
  const { getDetailPublicTour } = useTourService();

  const [tour, setTour] = useState<TourResponse | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // refs cho từng section (mỗi cái 1 useRef, dễ quản lý & đúng rules of hooks)
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const itineraryRef = useRef<HTMLDivElement | null>(null);
  const serviceRef = useRef<HTMLDivElement | null>(null);
  const policyRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = useCallback((key: SectionKey) => {
    const map: Record<SectionKey, React.RefObject<HTMLDivElement | null>> = {
      overview: overviewRef,
      itinerary: itineraryRef,
      service: serviceRef,
      policy: policyRef,
    };

    const ref = map[key].current;
    if (ref) {
      ref.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDetailPublicTour(id as string);
        setTour((res?.data ?? null) as TourResponse);
      } catch (e) {
        console.log("Lỗi khi lấy chi tiết tour:", e);
      }
    };
    if (id) fetchData();
  }, [id]);

  // tính discount
  const hasDiscount = useMemo(() => {
    if (!tour) return false;
    const d = Number(tour.discount);
    return Number.isFinite(d) && d > 0 && d < 100;
  }, [tour?.discount]);

  if (!tour)
    return (
      <div className="flex items-center justify-center h-[50vh] text-gray-500">
        Đang tải...
      </div>
    );

  const images = (tour.image_urls ?? []).map((it: any, idx: number) =>
    typeof it === "string" ? { img_id: idx, image: it } : it
  );

  const title = (tour as any).name ?? "Tour du lịch";

  const adultPrice = Number(tour.adult_price || 0);
  const discountPercent = Number(tour.discount || 0);

  const originalPrice = adultPrice;
  const finalPrice =
    hasDiscount && adultPrice > 0
      ? adultPrice * (1 - discountPercent / 100)
      : adultPrice;

  const displayPrice = finalPrice;
  const pickupPoints = tour.pickup_points;

  return (
    <div className="mx-auto pt-5 w-[95%] sm:w-[90%]">
      {/* Tên tour */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
        {title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Cột trái */}
        <div className="space-y-10">
          <Gallery
            images={images}
            tour={tour}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            hasDiscount={hasDiscount}
          />

          {/*  Tabs  */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="sticky top-0 bg-white z-10 flex justify-start gap-2 sm:gap-4 overflow-x-auto">
              <TabsTrigger
                value="overview"
                onClick={() => scrollTo("overview")}
                className="text-sm sm:text-base"
              >
                Tổng quan
              </TabsTrigger>

              <TabsTrigger
                value="itinerary"
                onClick={() => scrollTo("itinerary")}
                className="text-sm sm:text-base"
              >
                Lịch trình
              </TabsTrigger>

              <TabsTrigger
                value="service"
                onClick={() => scrollTo("service")}
                className="text-sm sm:text-base"
              >
                Dịch vụ bao gồm
              </TabsTrigger>

              <TabsTrigger
                value="policy"
                onClick={() => scrollTo("policy")}
                className="text-sm sm:text-base"
              >
                Chính sách &amp; Hướng dẫn viên
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* section*/}
          <div
            ref={overviewRef}
            className="space-y-3 sm:space-y-4 scroll-mt-20"
          >
            <Description description={tour.description ?? ""} />
          </div>

          <div
            ref={itineraryRef}
            className="space-y-3 sm:space-y-4 scroll-mt-20"
          >
            <Itinerary itinerary={tour.itinerary} />
          </div>

          <div ref={serviceRef} className="space-y-3 sm:space-y-4 scroll-mt-20">
            <Service
              included={tour.services_included}
              excluded={tour.services_excluded}
            />
          </div>

          <div ref={policyRef} className="space-y-3 sm:space-y-4 scroll-mt-20">
            <PolicyAndGuide policy={tour.policy} guide={tour.guide} />
          </div>

          {/* Review */}
          <ListReviewCard tourId={id as string} />
        </div>

        {/* Cột phải */}
        <div className="space-y-6 h-fit">
          <BookingCard
            pickup_points={pickupPoints}
            price={displayPrice}
            originalPrice={originalPrice}
            hasDiscount={hasDiscount}
            tourId={tour.tour_id}
          />

          <Sidebar tour={tour} />
        </div>
      </div>
    </div>
  );
};

export default PublicTourDetail;
