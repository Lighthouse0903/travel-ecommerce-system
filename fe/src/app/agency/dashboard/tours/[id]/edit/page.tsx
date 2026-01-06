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
import {
  editTourSchema,
  type BEItineraryDay,
  type EditTourFormValues,
  type TourResponse,
} from "@/types/tour";

import { parseActivityString } from "../../../../../../utils/activityMapper";

import BasicSection from "@/components/agency/edit_tour/BasicSection";
import ItinerarySection from "@/components/agency/edit_tour/ItinerarySection";
import ServicesPriceSection from "@/components/agency/edit_tour/ServicesPriceSection";
import PolicySection from "@/components/agency/edit_tour/PolicySection";
import MediaSection from "@/components/agency/edit_tour/MediaSection";
import EditTourSkeleton from "./EditTourSkeleton";
import EditActionsPanel from "@/components/agency/edit_tour/EditActionPanel";
import { buildTourFormDataForEdit } from "@/lib/tours/formData";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="min-h-[60vh] bg-background p-4 md:p-6">
        <EditTourSkeleton />
      </div>
    );
  }

  if (!tourId) {
    return (
      <div className="min-h-[60vh] bg-background p-4 md:p-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
          Không tìm thấy id tour.
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-5 md:px-6 bg-card rounded-xl border border-border">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Chỉnh sửa:{" "}
            <span className="text-primary">
              {form.watch("name") || tourPreview?.name || "Tour"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Cập nhật thông tin và trạng thái tour.
          </p>
        </div>

        <Button type="button" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <Form {...form}>
        <form id="edit-tour-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* cột trái */}
            <div className="space-y-5 lg:col-span-8">
              <BasicSection />
              <ItinerarySection />
              <ServicesPriceSection />
              <PolicySection />
            </div>

            {/* cột phải */}
            <div className="space-y-5 lg:col-span-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <EditActionsPanel
                  formId="edit-tour-form"
                  isSubmitting={form.formState.isSubmitting}
                  onCancel={() => router.back()}
                  onSubmit={onSubmit}
                />
              </div>

              <MediaSection tourPreview={tourPreview} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditTourPage;
