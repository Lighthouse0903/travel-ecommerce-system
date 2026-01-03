"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useTourService } from "@/services/tourService";
import type { BEItineraryDay, TourResponse } from "@/types/tour";

import { editTourSchema, type EditTourFormValues } from "./formSchema";
import { buildTourFormDataForEdit } from "./formData";
import { parseActivityString } from "./activityMapper";

import BasicSection from "@/components/agency/edit_tour/BasicSection";
import ItinerarySection from "@/components/agency/edit_tour/ItinerarySection";
import ServicesPriceSection from "@/components/agency/edit_tour/ServicesPriceSection";
import PolicySection from "@/components/agency/edit_tour/PolicySection";
import MediaSection from "@/components/agency/edit_tour/MediaSection";
import EditTourSkeleton from "./EditTourSkeleton";
import EditActionsPanel from "@/components/agency/edit_tour/EditActionPanel";
import TourDetailMotion from "@/components/common/tours/TourDetailMotion";
import { MotionItem } from "@/components/common/motion/MotionFlow";

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-2xl border shadow-sm ${className}`}>
    {children}
  </div>
);

const EditTourPage = () => {
  const params = useParams();
  const router = useRouter();
  const tourId = useMemo(() => (params?.id as string) || "", [params]);

  const { getDetailTour, updateTour } = useTourService();

  const [loading, setLoading] = useState(true);
  const [tourPreview, setTourPreview] = useState<TourResponse | null>(null);

  const form = useForm<EditTourFormValues>({
    resolver: zodResolver(editTourSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      departure_location: "",
      destination: "",
      duration_days: 1,
      region: 1,
      categories: [],

      adult_price: 0,
      children_price: 0,
      discount: "",

      itinerary: [],
      transportation: [],
      services_included: [],
      services_excluded: [],

      policy: { deposit_percent: 0, cancellation_fee: "", refund_policy: "" },

      thumbnail: undefined,
      images: [],

      is_active: true,
    },
  });

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
        setTourPreview(null);
        toast.error(res.message ?? "Không lấy được chi tiết tour.");
        setLoading(false);
        return;
      }

      const tour = res.data as TourResponse;
      setTourPreview(tour);

      const mapped: EditTourFormValues = {
        name: tour.name ?? "",
        description: tour.description ?? "",
        departure_location: tour.departure_location ?? "",
        destination: tour.destination ?? "",
        duration_days: Number(tour.duration_days ?? 1),
        region: Number(tour.region ?? 1),
        categories: tour.categories ?? [],

        adult_price: tour.adult_price ?? 0,
        children_price: tour.children_price ?? 0,
        discount: tour.discount ?? "",

        itinerary: ((tour.itinerary ?? []) as unknown as BEItineraryDay[]).map(
          (d) => ({
            day: Number(d.day ?? 1),
            title: d.title ?? "",
            accommodation: d.accommodation ?? null,
            activities: (d.activities ?? []).map(parseActivityString),
          })
        ),

        transportation: tour.transportation ?? [],
        services_included: tour.services_included ?? [],
        services_excluded: tour.services_excluded ?? [],

        policy: tour.policy ?? {
          deposit_percent: 0,
          cancellation_fee: "",
          refund_policy: "",
        },

        thumbnail: undefined,
        images: [],

        is_active: typeof tour.is_active === "boolean" ? tour.is_active : true,
      };

      form.reset(mapped);
      setLoading(false);
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [tourId]);

  const onSubmit = async (values: EditTourFormValues) => {
    if (!tourId) return;

    const fd = buildTourFormDataForEdit(values);
    const res = await updateTour(tourId, fd);

    if (!res.success) {
      toast.error(res.message ?? "Cập nhật tour thất bại.");
      return;
    }
    toast.success(res.message ?? "Cập nhật tour thành công.");
    router.refresh();
    router.push(`/agency/dashboard/tours/${tourId}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <EditTourSkeleton />
      </div>
    );
  }

  if (!tourId) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center text-gray-600">
          Không tìm thấy id tour.
        </Card>
      </div>
    );
  }

  const currentName = form.watch("name") || tourPreview?.name || "Tour";

  return (
    <div className="mx-auto max-w-6xl px-3 md:px-6 py-6">
      <TourDetailMotion>
        {/* Header */}
        <MotionItem className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">
                Chỉnh sửa:{" "}
                <span className="text-primary">
                  {form.watch("name") || tourPreview?.name || "Tour"}
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Cập nhật thông tin và trạng thái tour.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="shrink-0"
            >
              ← Quay lại
            </Button>
          </div>
        </MotionItem>

        <Form {...form}>
          <form id="edit-tour-form">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT */}
              <div className="lg:col-span-8 space-y-6">
                <MotionItem>
                  <BasicSection />
                </MotionItem>

                <MotionItem>
                  <ItinerarySection />
                </MotionItem>

                <MotionItem>
                  <ServicesPriceSection />
                </MotionItem>

                <MotionItem>
                  <PolicySection />
                </MotionItem>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-4 space-y-6">
                <MotionItem>
                  <EditActionsPanel
                    formId="edit-tour-form"
                    isSubmitting={form.formState.isSubmitting}
                    onCancel={() => router.back()}
                    onSubmit={onSubmit}
                  />
                </MotionItem>

                <MotionItem>
                  <MediaSection tourPreview={tourPreview} />
                </MotionItem>
              </div>
            </div>
          </form>
        </Form>
      </TourDetailMotion>
    </div>
  );
};

export default EditTourPage;
