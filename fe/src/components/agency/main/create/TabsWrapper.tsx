"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, FormProvider } from "react-hook-form";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { TourRequest } from "@/types/tour";
import { useTourService } from "@/services/tourService";
import { toast } from "sonner";

// Lazy-load từng tab
const BasicInfor = dynamic(() => import("./BasicInfor"), { ssr: false });
const Itinerary = dynamic(() => import("./Itinerary"), { ssr: false });
const ServicesAndPrice = dynamic(() => import("./ServicesAndPrice"), {
  ssr: false,
});
const PolicyAndMedia = dynamic(() => import("./PolicyAndMedia"), {
  ssr: false,
});

export default function TabsWrapper() {
  const [tab, setTab] = useState("basicInfo");
  const { createTour } = useTourService();

  const methods = useForm<TourRequest>({
    defaultValues: {
      name: "",
      description: "",
      adult_price: "",
      children_price: "",
      discount: "",
      duration_days: 1,

      start_location: "",
      end_location: "",
      destination: "",
      region: 1,

      categories: [],

      pickup_points: [],
      itinerary: [],
      transportation: [],
      services_included: [],
      services_excluded: [],
      policy: { deposit_percent: 0, cancellation_fee: "", refund_policy: "" },
      guide: { name_guide: "", phone_guide: "", experience_years: 0 },

      images: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: TourRequest) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // files
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => formData.append("images", file));
        return;
      }

      // categories: gửi JSON array (BE validate parse JSON/chuỗi)
      if (key === "categories" && Array.isArray(value)) {
        value.forEach((cat) => formData.append("categories", cat));
        return;
      }

      // JSON fields
      if (
        [
          "pickup_points",
          "itinerary",
          "transportation",
          "services_included",
          "services_excluded",
          "policy",
          "guide",
        ].includes(key)
      ) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    });

    console.log("Thông tin gửi đi trong FormData: ");
    for (const [k, v] of formData.entries()) {
      console.log(k, v);
    }

    try {
      const res = await createTour(formData);
      console.log("Thông tin tour nhận về: ", res);
      if (res.success) {
        if (typeof res.message === "string") toast.success(res.message);
      } else {
        console.log(res.error);
      }
    } catch (err) {
      console.error("Lỗi khi tạo tour:", err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="basicInfo">Thông tin chung</TabsTrigger>
            <TabsTrigger value="itinerary">Lịch trình</TabsTrigger>
            <TabsTrigger value="servicesAndPrice">Dịch vụ</TabsTrigger>
            <TabsTrigger value="policyAndMedia">
              Chính sách & hình ảnh
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basicInfo">
            <BasicInfor />
          </TabsContent>
          <TabsContent value="itinerary">
            <Itinerary />
          </TabsContent>
          <TabsContent value="servicesAndPrice">
            <ServicesAndPrice />
          </TabsContent>
          <TabsContent value="policyAndMedia">
            <PolicyAndMedia />
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="px-6" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo tour"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
