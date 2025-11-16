"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTourService } from "@/services/tourService";
import Gallery from "@/components/common/tours/tour-detail/Gallery";
import Description from "@/components/common/tours/tour-detail/Description";
import Itinerary from "@/components/common/tours/tour-detail/Itinerary";
import Service from "@/components/common/tours/tour-detail/Service";
import PolicyAndGuide from "@/components/common/tours/tour-detail/PolicyAndGuide";
import Sidebar from "@/components/common/tours/tour-detail/Sidebar";
import { TourResponse } from "@/types/tour";
import { toast } from "sonner";

const TourDetail: React.FC = () => {
  const { id } = useParams();
  console.log("Id tour: ", id as string);
  const { getDetailTour, updateTour } = useTourService();

  const [tour, setTour] = useState<TourResponse | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await getDetailTour(id as string);
        if (!mounted) return;
        const data = (res?.data ?? null) as TourResponse | null;
        setTour(data);
      } catch (e) {
        console.log("Lỗi khi lấy chi tiết tour:", e);
        setTour(null);
      }
    };
    if (id) fetchData();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Clamp activeIndex khi số ảnh thay đổi
  useEffect(() => {
    if (!tour?.image_urls) return;
    setActiveIndex((i) => {
      const last = Math.max(0, tour.image_urls.length - 1);
      return Math.min(i, last);
    });
  }, [tour?.image_urls?.length]);

  const hasDiscount = useMemo(() => {
    if (!tour) return false;
    const d = Number(tour.discount);
    return Number.isFinite(d) && d > 0;
  }, [tour?.discount]);

  if (!tour)
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Đang tải thông tin tour...
      </div>
    );

  const images = (tour.image_urls ?? []).map((it: any, idx: number) =>
    typeof it === "string"
      ? { img_id: idx, image: it }
      : { img_id: it?.img_id ?? idx, image: it?.image ?? "" }
  );

  function toFormData(partial: Record<string, any>) {
    const fd = new FormData();
    Object.entries(partial).forEach(([k, v]) => {
      if (v === undefined) return;
      if (v instanceof File || v instanceof Blob) fd.append(k, v);
      else if (Array.isArray(v) || typeof v === "object")
        fd.append(k, JSON.stringify(v));
      else fd.append(k, String(v));
    });
    return fd;
  }

  const patchTour = async (partial: Record<string, any>) => {
    if (!id) return { success: false, message: "Missing id" };
    setSaving(true);
    try {
      const fd = toFormData(partial);
      const res = await updateTour(id as string, fd); // service đã chuẩn hoá trả {success,data,message}
      if (res.success) {
        // đồng bộ UI ngay: merge phần vừa sửa vào state
        setTour((prev) => (prev ? ({ ...prev, ...partial } as any) : prev));
      }
      return res;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2 space-y-6">
        <Gallery
          images={images}
          tour={tour}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          hasDiscount={hasDiscount}
        />
        <Description
          saving={saving}
          editable={true}
          onUpdate={async (newDesc) => {
            const res = await patchTour({ description: newDesc });
            toast.success("Cập nhật mô tả thành công");
          }}
          description={tour.description ?? ""}
        />
        <Itinerary
          itinerary={tour.itinerary}
          editable={true}
          saving={saving}
          onUpdate={async (partial) => {
            // partial = { itinerary: DayItinerary[] }
            const res = await patchTour(partial);
            toast.success("Cập nhật lịch trình thành công");
          }}
        />

        <Service
          included={tour.services_included}
          excluded={tour.services_excluded}
          saving={saving}
          editable={true}
          onUpdate={async ({ services_included, services_excluded }) => {
            // cha stringify object/array khi build FormData trong patchTour
            const res = await patchTour({
              services_included,
              services_excluded,
            });
            toast.success("Cập nhật dịch vụ thành công");
          }}
        />

        <PolicyAndGuide
          policy={tour.policy}
          guide={tour.guide}
          editable={true}
          saving={saving}
          onUpdate={async ({ policy, guide }) => {
            const res = await patchTour({ policy, guide });
            toast.success("Cập nhật Chính sách & Hướng dẫn viên thành công");
          }}
        />
      </main>
      <Sidebar
        tour={tour}
        saving={saving}
        editable={true}
        onUpdate={async (partial) => {
          const res = await patchTour(partial);
          toast.success("Cập nhật thông tin thành công");
        }}
      />
    </div>
  );
};

export default TourDetail;
