"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { useTourService } from "@/services/tourService";
import type { TourResponse } from "@/types/tour";

import GalleryView from "@/components/common/tours/GalleryView";
import ItineraryView from "@/components/common/tours/ItineraryView";
import ServiceView from "@/components/common/tours/ServiceView";
import DesciptionView from "@/components/common/tours/DesciptionView";
import TourMetaPanel from "@/components/common/tours/SidebarView";
import AgencyPolicyView from "@/components/common/tours/AgencyPolicyView";

import TourDetailSkeleton from "./TourDetailSkeleton";
import { Button } from "@/components/ui/button";

type GalleryItem = { img_id?: string | number; image: string };

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

const normalizeActivityToString = (a: unknown) => {
  if (typeof a === "string") return a.trim();
  if (!a || typeof a !== "object") return "";
  const obj = a as { time?: unknown; text?: unknown };
  const time = typeof obj.time === "string" ? obj.time.trim() : "";
  const text = typeof obj.text === "string" ? obj.text.trim() : "";
  if (time && text) return `${time} - ${text}`;
  return text || "";
};

const TourDetailPage: React.FC = () => {
  const params = useParams();
  const tourId = (params?.id as string) || "";

  const { getDetailTour } = useTourService();

  const [tour, setTour] = useState<TourResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!tourId) {
        if (mounted) setLoading(false);
        return;
      }

      setLoading(true);
      const res = await getDetailTour(tourId);

      if (!mounted) return;

      if (!res.success) {
        setTour(null);
        setLoading(false);
        toast.error(res.message ?? "Không lấy được chi tiết tour.");
        return;
      }

      setTour(res.data ?? null);
      setLoading(false);
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [tourId]);

  const thumbnail = tour?.thumbnail_url ?? null;

  const images: GalleryItem[] = useMemo(() => {
    return (tour?.image_urls ?? [])
      .map((it, idx) => {
        if (typeof it === "string") return { img_id: idx, image: it };
        return { img_id: it.img_id ?? idx, image: it.image ?? "" };
      })
      .filter((x) => !!x.image);
  }, [tour?.image_urls]);

  const itineraryForView: DayItineraryView[] = useMemo(() => {
    return (tour?.itinerary ?? []).map((d) => {
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
    });
  }, [tour?.itinerary]);

  const servicesIncluded = tour?.services_included ?? [];
  const servicesExcluded = tour?.services_excluded ?? [];
  const policy = tour?.policy ?? null;
  const description = tour?.description ?? "";

  if (loading) return <TourDetailSkeleton />;

  if (!tour) {
    return (
      <div className="mx-auto max-w-6xl px-3 md:px-6 py-12">
        <div className="bg-white rounded-2xl border p-8 text-center text-gray-600">
          Không tìm thấy thông tin tour hoặc tour đã bị xoá.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-3 md:px-6 py-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {tour.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tour.departure_location}{" "}
            {tour.destination ? `→ ${tour.destination}` : ""}
          </p>
        </div>

        <Link href={`/agency/dashboard/tours/${tourId}/edit`}>
          <Button className="gap-2">
            <Pencil className="w-4 h-4" />
            Chỉnh sửa tour
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border shadow-sm p-3">
            <GalleryView thumbnail={thumbnail} images={images} />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <TourMetaPanel tour={tour} />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <section className="scroll-mt-36">
          <DesciptionView description={description} />
        </section>

        <section className="scroll-mt-36">
          <ItineraryView itinerary={itineraryForView} />
        </section>

        <section className="scroll-mt-36">
          <ServiceView
            included={servicesIncluded}
            excluded={servicesExcluded}
          />
        </section>

        <section className="scroll-mt-36">
          <AgencyPolicyView policy={policy} />
        </section>
      </div>
    </div>
  );
};

export default TourDetailPage;
