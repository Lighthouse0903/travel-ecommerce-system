"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import StepBasic from "@/components/customer/register_agency/apply/StepBasic";
import StepLegal from "@/components/customer/register_agency/apply/StepLegal";
import StepBank from "@/components/customer/register_agency/apply/StepBank";
import StepDocs from "@/components/customer/register_agency/apply/StepDocs";
import StepReview from "@/components/customer/register_agency/apply/StepReview";
import { RegisterAgencyFormValues } from "@/types/agency";
import { schemasByStep } from "./formSchema";
import { useAgencyAction } from "@/hooks/useAgencyAction";

const STEPS = [
  { key: "basic", title: "Thông tin đại lý", desc: "Nhập thông tin cơ bản" },
  { key: "legal", title: "Pháp lý", desc: "Thông tin đại diện & giấy phép" },
  { key: "bank", title: "Ngân hàng", desc: "Thông tin thanh toán" },
  {
    key: "docs",
    title: "Tài liệu",
    desc: " Tải lên giấy tờ bắt buộc để hệ thống duyệt hồ sơ. Ảnh rõ nét, không bị che góc.",
  },
  {
    key: "review",
    title: "Xác nhận",
    desc: " Kiểm tra lại toàn bộ thông tin trước khi gửi đăng ký. Nếu cần chỉnh sửa, bấm “Quay lại”.",
  },
] as const;

const DRAFT_KEY = "agency_register_draft_v1";

type DraftValues = Omit<
  RegisterAgencyFormValues,
  "license_file" | "legal_id_front" | "legal_id_back" | "avatar"
>;

const RegisterAgencyApplyPage = () => {
  const [step, setStep] = useState(0);
  const currentStep = useMemo(() => STEPS[step], [step]);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const isLast = step === STEPS.length - 1;
  const { submitRegisterAgency, guardRegisterAgencyPage } = useAgencyAction();

  // định nghĩa form Đăng kí
  const form = useForm<RegisterAgencyFormValues>({
    mode: "onTouched",
    defaultValues: {
      // Step 1 – Thông tin đại lý
      agency_name: "",
      agency_type: "business",
      email_agency: "",
      hotline: "",
      address_agency: "",
      description: "",

      // Step 2 – Pháp lý
      license_number: "",
      legal_representative_name: "",
      legal_id_number: "",
      tax_code: "",

      // Step 3 – Ngân hàng
      bank_name: "",
      bank_account_number: "",
      bank_account_holder: "",

      // Step 4 – File
      license_file: null,
      legal_id_front: null,
      legal_id_back: null,
      avatar: null,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // check xem tài khoản này đã đăng kí lên đại lý chưa
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setCheckingProfile(true);
        const res = await guardRegisterAgencyPage();
        if (!mounted) return;

        if (res.allow) {
          setCheckingProfile(false);
        } else {
          // bị redirect, nhưng vẫn tắt loading để khỏi kẹt UI nếu redirect lỗi
          setCheckingProfile(false);
        }
      } catch (e) {
        if (!mounted) return;
        setCheckingProfile(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  // check xem nếu localStorage có chứa DRAFT_KEY thì lôi lên để add lại vào form
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;

      const draft = JSON.parse(raw) as Partial<DraftValues>;

      form.reset({
        ...form.getValues(),
        ...draft,
        license_file: null,
        legal_id_front: null,
        legal_id_back: null,
        avatar: null,
      });
    } catch (e) {
      console.warn("Draft parse error:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const sub = form.watch(() => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        const v = form.getValues();

        const draft: DraftValues = {
          agency_name: v.agency_name,
          agency_type: v.agency_type,
          email_agency: v.email_agency,
          hotline: v.hotline,
          address_agency: v.address_agency,
          description: v.description,

          license_number: v.license_number,
          legal_representative_name: v.legal_representative_name,
          legal_id_number: v.legal_id_number,
          tax_code: v.tax_code,

          bank_name: v.bank_name,
          bank_account_number: v.bank_account_number,
          bank_account_holder: v.bank_account_holder,
        };

        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      }, 500);
    });

    return () => {
      if (timer) clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [form]);

  if (checkingProfile) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Đang kiểm tra trạng thái đăng ký đại lý...
      </div>
    );
  }

  // Validate cho từng step
  const validateStep = (s: number) => {
    const schema = schemasByStep[s as keyof typeof schemasByStep];
    if (!schema) return true;

    const values = form.getValues();
    const result = schema.safeParse(values);

    if (result.success) return true;

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof RegisterAgencyFormValues;
      form.setError(field, { type: "zod", message: issue.message });
    });

    return false;
  };

  const goNext = () => {
    const ok = validateStep(step);
    if (!ok) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const onSubmit = async (values: RegisterAgencyFormValues) => {
    for (let s = 0; s <= 3; s++) {
      const ok = validateStep(s);
      if (!ok) {
        setStep(s);
        return;
      }
    }
    await submitRegisterAgency(values);
  };

  return (
    <div className="w-full px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Breadcrumb>
              <BreadcrumbList className="text-base md:text-lg">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Tổng quan</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/register_agency/terms">
                    Đăng ký đại lý
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Đăng ký</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <p className="mt-1 text-sm text-muted-foreground">
              Hoàn thành từng bước để gửi hồ sơ đăng ký đại lý
            </p>
          </div>

          <Badge variant="secondary">
            Bước {step + 1}/{STEPS.length}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{currentStep.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{currentStep.desc}</p>
        </CardHeader>
        <Separator />

        <CardContent className="space-y-6">
          <Form {...form}>
            <form className="space-y-6">
              {step === 0 && <StepBasic />}
              {step === 1 && <StepLegal />}
              {step === 2 && <StepBank />}
              {step === 3 && <StepDocs />}
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
                    {isSubmitting ? "Đang gửi..." : "Xác nhận gửi đăng ký"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterAgencyApplyPage;
