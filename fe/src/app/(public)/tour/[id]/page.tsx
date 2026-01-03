import { notFound } from "next/navigation";
import { MapPin, Star } from "lucide-react";

import type { TourResponse } from "@/types/tour";
import { getDetailPublicTourServer } from "@/services/serverTourService";

import GalleryView from "@/components/common/tours/GalleryView";
import ItineraryView from "@/components/common/tours/ItineraryView";
import ServiceView from "@/components/common/tours/ServiceView";
import PolicyView from "@/components/common/tours/PolicyView";
import DesciptionView from "@/components/common/tours/DesciptionView";
import ReviewList from "@/components/common/review/ReviewList";
import TourDetailMotion, {
  MotionItem,
} from "@/components/common/tours/TourDetailMotion";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BookingCardView from "@/components/customer/booking/BookingCard";
import TourDetailChatWidget from "@/components/common/tours/TourDetailChatWidget";

type GalleryItem = {
  img_id?: string | number;
  image: string;
};

type DayItineraryView = {
  day: number;
  title: string;
  activities: string[];
  accommodation: {
    hotel_name: string;
    stars: number;
    nights: number;
    address: string;
  } | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const normalizeActivityToString = (a: unknown) => {
  if (typeof a === "string") return a.trim();
  if (!a || typeof a !== "object") return "";
  const obj = a as { time?: unknown; text?: unknown };
  const time = typeof obj.time === "string" ? obj.time.trim() : "";
  const text = typeof obj.text === "string" ? obj.text.trim() : "";
  if (time && text) return `${time} - ${text}`;
  return text || "";
};

const formatDuration = (days: number) => {
  const d = Number(days ?? 0);
  if (!Number.isFinite(d) || d <= 0) return "";
  if (d === 1) return "1 ngày";
  return `${d} ngày ${d - 1} đêm`;
};

const regionLabel = (region: unknown) => {
  const r = Number(region ?? 0);
  if (r === 1) return "Miền Bắc";
  if (r === 2) return "Miền Trung";
  if (r === 3) return "Miền Nam";
  return "Tour";
};

export default async function TourDetailPage({ params }: PageProps) {
  const { id } = await params;

  const tour: TourResponse | null = await getDetailPublicTourServer(id);
  if (!tour) notFound();

  const thumbnail = tour.thumbnail_url ?? null;

  const images: GalleryItem[] = (tour.image_urls ?? [])
    .map((it, idx: number) => {
      if (typeof it === "string") return { img_id: idx, image: it };
      return { img_id: it?.img_id ?? idx, image: it?.image ?? "" };
    })
    .filter((x) => !!x.image);

  const itineraryForView: DayItineraryView[] = (tour.itinerary ?? []).map(
    (d) => {
      const activitiesRaw = Array.isArray(d.activities) ? d.activities : [];
      const activities = activitiesRaw
        .map(normalizeActivityToString)
        .filter(Boolean);

      const acc = d.accommodation ?? null;

      return {
        day: d.day,
        title: d.title ?? "",
        activities,
        accommodation: acc
          ? {
              hotel_name: acc.hotel_name ?? "",
              stars: Number(acc.stars ?? 0),
              nights: Number(acc.nights ?? 0),
              address: acc.address ?? "",
            }
          : null,
      };
    }
  );

  const servicesIncluded = tour.services_included ?? [];
  const servicesExcluded = tour.services_excluded ?? [];
  const policy = tour.policy ?? null;
  const description = tour.description ?? "";

  const durationText = formatDuration(tour.duration_days);
  const ratingValue = Number(tour.rating ?? 0);
  const reviewsCount = Number(tour.reviews_count ?? 0);

  const regionText = regionLabel(tour.region);

  const fromText = (tour.departure_location ?? "").trim();
  const toText = (tour.destination ?? "").trim();
  const routeText = [fromText, toText].filter(Boolean).join(" → ");
  const hasDiscount = Number(tour.discount);
  const finalPrice = ((100 - hasDiscount) * Number(tour.adult_price)) / 100;
  const finalChildPrice =
    ((100 - hasDiscount) * Number(tour.children_price)) / 100;

  return (
    <div className="mx-auto w-[95%] md:w-[90%] px-3 md:px-6 py-6">
      <TourDetailMotion>
        <MotionItem className="space-y-2">
          <header className="space-y-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbLink href="/tour">Danh mục Tour</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbPage>{regionText}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {tour.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  {(fromText || toText) && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {routeText}
                    </span>
                  )}

                  {durationText && <span>| {durationText}</span>}

                  <span className="inline-flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-gray-900">
                      {ratingValue.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({reviewsCount} đánh giá)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </header>
        </MotionItem>

        {/* Cột trái */}
        <MotionItem className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MotionItem>
                <GalleryView thumbnail={thumbnail} images={images} />
              </MotionItem>

              <MotionItem>
                <DesciptionView description={description} />
              </MotionItem>

              <MotionItem>
                <ItineraryView itinerary={itineraryForView} />
              </MotionItem>

              <MotionItem>
                <ServiceView
                  included={servicesIncluded}
                  excluded={servicesExcluded}
                />
              </MotionItem>

              <MotionItem>
                <PolicyView
                  policy={policy}
                  agency={{
                    name: tour.agency_name,
                    phone: tour.hotline,
                    email: tour.email_agency,
                  }}
                />
              </MotionItem>
              <MotionItem>
                <div className="space-y-4 boder bg-slate-50 p-4 rounded-xl shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Đánh giá của khách hàng
                    </h3>
                    <div className="text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-gray-900">
                          {ratingValue.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                          ({reviewsCount} đánh giá)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* List review */}
                  <ReviewList tourId={tour.tour_id} />
                </div>
              </MotionItem>
            </div>
            {/* Cột phải */}
            <MotionItem className="lg:col-span-1">
              <div className="lg:col-span-1">
                <BookingCardView
                  tourId={tour.tour_id}
                  departure_location={tour.departure_location}
                  price={Number(tour.adult_price)}
                  childPrice={Number(tour.children_price)}
                  finalPrice={finalPrice}
                  finalChildPrice={finalChildPrice}
                  hasDiscount={Number(tour.discount ?? 0) === 0 ? false : true}
                />
              </div>
            </MotionItem>
            <TourDetailChatWidget
              agencyUserId={tour.agency_user_id}
              agencyName={tour.agency_name || "Đại lý"}
              agencyAvatarUrl={tour.agency_avatar_url}
            />
          </div>
        </MotionItem>
      </TourDetailMotion>
    </div>
  );
}
