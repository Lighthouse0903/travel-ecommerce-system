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
import { formatDuration } from "@/utils/formatDuration";
import { getRegionLabel } from "@/utils/formatRegion";

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

const toNumberSafe = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
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
              stars: toNumberSafe(acc.stars),
              nights: toNumberSafe(acc.nights),
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
  const ratingValue = toNumberSafe(tour.rating);
  const reviewsCount = toNumberSafe(tour.reviews_count);

  const regionText = getRegionLabel(tour.region);

  const fromText = (tour.departure_location ?? "").trim();
  const toText = (tour.destination ?? "").trim();
  const routeText = [fromText, toText].filter(Boolean).join(" → ");

  // Giá cả
  const adultPrice = toNumberSafe(tour.adult_price);
  const childPrice = toNumberSafe(tour.children_price);

  const discountPercent = toNumberSafe(tour.discount);
  const hasDiscount = discountPercent > 0;

  const finalPrice = hasDiscount
    ? (adultPrice * (100 - discountPercent)) / 100
    : adultPrice;
  const finalChildPrice = hasDiscount
    ? (childPrice * (100 - discountPercent)) / 100
    : childPrice;

  return (
    <div className="mx-auto w-[95%] md:w-[90%] px-3 md:px-6 py-6">
      {/* Header */}
      <header className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/tours">Danh mục tour</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{regionText}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              {tour.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              {(fromText || toText) && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700">{routeText}</span>
                </span>
              )}

              {durationText && <span className="text-slate-400">|</span>}
              {durationText && <span>{durationText}</span>}

              <span className="text-slate-400">|</span>

              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-slate-900">
                  {ratingValue.toFixed(1)}
                </span>
                <span className="text-slate-500">
                  ({reviewsCount} đánh giá)
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <GalleryView thumbnail={thumbnail} images={images} />

          <DesciptionView description={description} />

          <ItineraryView itinerary={itineraryForView} />

          <ServiceView
            included={servicesIncluded}
            excluded={servicesExcluded}
          />

          <PolicyView
            policy={policy}
            agency={{
              name: tour.agency_name,
              phone: tour.hotline,
              email: tour.email_agency,
            }}
          />

          {/* Review */}
          <section className="space-y-4 border border-slate-200 bg-card p-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Đánh giá của khách hàng
              </h3>

              <div className="text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-900">
                    {ratingValue.toFixed(1)}
                  </span>
                  <span className="text-slate-500">
                    ({reviewsCount} đánh giá)
                  </span>
                </span>
              </div>
            </div>

            <ReviewList tourId={tour.tour_id} />
          </section>
        </div>

        {/* Right */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <BookingCardView
              tourId={tour.tour_id}
              departure_location={tour.departure_location}
              price={adultPrice}
              childPrice={childPrice}
              finalPrice={finalPrice}
              finalChildPrice={finalChildPrice}
              hasDiscount={hasDiscount}
            />
          </div>
        </div>

        {/* Chat widget */}
        <TourDetailChatWidget
          agencyUserId={tour.agency_user_id}
          agencyName={tour.agency_name || "Đại lý"}
          agencyAvatarUrl={tour.agency_avatar_url}
        />
      </div>
    </div>
  );
}
