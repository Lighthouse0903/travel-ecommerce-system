"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { schemasByStep, type TourRequest } from "@/types/tour";
import { useTourAction } from "@/hooks/useTourAction";

const BasicInfor = dynamic(
  () => import("@/components/agency/create/steps/StepBasic"),
  { ssr: false }
);
const Itinerary = dynamic(
  () => import("@/components/agency/create/steps/StepItinerary"),
  {
    ssr: false,
  }
);
const ServicesAndPrice = dynamic(
  () => import("@/components/agency/create/steps/StepServices"),
  {
    ssr: false,
  }
);
const PolicyAndMedia = dynamic(
  () => import("@/components/agency/create/steps/StepPolicyMedia"),
  {
    ssr: false,
  }
);
const StepReview = dynamic(
  () => import("@/components/agency/create/steps/StepReview"),
  { ssr: false }
);

const STEPS = [
  { key: "basic", title: "Thông tin tour", desc: "Nhập thông tin cơ bản" },
  { key: "itinerary", title: "Lịch trình", desc: "Xây dựng lịch trình tour" },
  {
    key: "services",
    title: "Giá & dịch vụ",
    desc: "Giá tour, phương tiện, dịch vụ bao gồm/không bao gồm",
  },
  {
    key: "policy_media",
    title: "Chính sách & hình ảnh",
    desc: "Thiết lập chính sách + tải ảnh thumbnail và ảnh gallery",
  },
  {
    key: "review",
    title: "Xác nhận",
    desc: "Kiểm tra lại toàn bộ thông tin trước khi tạo tour",
  },
] as const;

const DRAFT_KEY = "tour_create_draft_v1";

type DraftValues = Omit<TourRequest, "thumbnail" | "images">;

const TourCreateWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const currentStep = useMemo(() => STEPS[step], [step]);
  const isLast = step === STEPS.length - 1;
  const { submitCreateTour } = useTourAction();
  // khởi tạo TourFOrm
  const form = useForm<TourRequest>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",

      adult_price: 0,
      children_price: 0,
      discount: 0,

      duration_days: 1,

      departure_location: "",
      destination: "",
      region: 1,

      categories: [],

      itinerary: [
        {
          day: 1,
          title: "",
          activities: [{ time: "", text: "" }],
          accommodation: null,
        },
      ],
      transportation: [],
      services_included: [],
      services_excluded: [],

      policy: {
        deposit_percent: 0,
        cancellation_fee: "",
        refund_policy: "",
      },

      thumbnail: undefined,
      images: [],

      is_active: true,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<DraftValues>;
      form.reset({
        ...form.getValues(),
        ...draft,
        thumbnail: undefined,
        images: [],
      });
    } catch {}
  }, [form]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const sub = form.watch(() => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        const v = form.getValues();

        const draft: DraftValues = {
          name: v.name,
          description: v.description,

          adult_price: v.adult_price,
          children_price: v.children_price,
          discount: v.discount,

          duration_days: v.duration_days,

          departure_location: v.departure_location,
          destination: v.destination,
          region: v.region,

          categories: v.categories,

          itinerary: v.itinerary,
          transportation: v.transportation,
          services_included: v.services_included,
          services_excluded: v.services_excluded,

          policy: v.policy,
          is_active: v.is_active,
        };

        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      }, 500);
    });

    return () => {
      if (timer) clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [form]);

  const validateStep = (s: number) => {
    const schema = schemasByStep[s as keyof typeof schemasByStep];
    if (!schema) return true;

    const values = form.getValues();
    const result = schema.safeParse(values);

    if (result.success) return true;

    result.error.issues.forEach((issue) => {
      const field = issue.path.join(".") as keyof TourRequest;
      if (!field) return;
      form.setError(field, { type: "zod", message: issue.message });
    });

    return false;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const onSubmit = async (values: TourRequest) => {
    for (let s = 0; s <= 3; s++) {
      if (!validateStep(s)) {
        setStep(s);
        return;
      }
    }
    await submitCreateTour(values);
  };

  return (
    <div className="w-full px-8 py-8 space-y-5">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base md:text-lg font-semibold">Tạo mới tour</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hoàn thành từng bước để đăng tour
            </p>
          </div>

          <Badge variant="secondary">
            Bước {step + 1}/{STEPS.length}
          </Badge>
        </div>
      </div>

      <Card className="border-0 bg-white shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{currentStep.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{currentStep.desc}</p>
        </CardHeader>

        <CardContent className="space-y-6 mt-3 px-4">
          <Form {...form}>
            <form className="space-y-6">
              <fieldset disabled={isSubmitting} className="space-y-4">
                {step === 0 && <BasicInfor />}
                {step === 1 && <Itinerary />}
                {step === 2 && <ServicesAndPrice />}
                {step === 3 && <PolicyAndMedia />}
                {step === 4 && <StepReview />}

                <Separator />

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={step === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Quay lại
                  </Button>

                  {!isLast ? (
                    <Button type="button" onClick={goNext} className="gap-2">
                      Tiếp tục
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? "Đang tạo..." : "Tạo tour"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TourCreateWizard;
