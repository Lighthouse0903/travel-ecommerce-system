"use client";

import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { TourRequest } from "@/types/tour";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_MAP } from "@/types/tour";

const StepReview = () => {
  const { watch } = useFormContext<TourRequest>();
  const v = watch();

  const thumbnailPreview = useMemo(() => {
    if (!v.thumbnail) return null;
    return URL.createObjectURL(v.thumbnail);
  }, [v.thumbnail]);

  const imagePreviews = useMemo(() => {
    const files = (v.images || []) as File[];
    return files.slice(0, 6).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
  }, [v.images]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      imagePreviews.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }, [thumbnailPreview, imagePreviews]);

  const categoriesLabel =
    (v.categories || []).map((c) => CATEGORY_MAP[c] ?? c).join(", ") || "-";

  const regionLabel =
    v.region === 1 ? "Miền Bắc" : v.region === 2 ? "Miền Trung" : "Miền Nam";

  const itinerarySummary = (v.itinerary || []).map((d) => ({
    day: d.day,
    title: d.title,
    activitiesCount: (d.activities || []).filter(Boolean).length,
    hasAccommodation: !!d.accommodation,
  }));

  return (
    <div className="space-y-5">
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Xem lại tour</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Khu vực: {regionLabel}</Badge>
            <Badge variant="secondary">Số ngày: {v.duration_days}</Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tên tour</p>
              <p className="font-medium">{v.name || "-"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Khởi hành → Điểm đến
              </p>
              <p className="font-medium">
                {v.departure_location || "-"} → {v.destination || "-"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm text-muted-foreground">Danh mục</p>
              <p className="font-medium">{categoriesLabel}</p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm text-muted-foreground">Mô tả</p>
              <p className="whitespace-pre-wrap">{v.description || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Giá & Dịch vụ</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Giá người lớn</p>
              <p className="font-medium">
                {v.adult_price ?? v.adult_price === 0
                  ? String(v.adult_price)
                  : "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Giá trẻ em</p>
              <p className="font-medium">
                {v.children_price ?? v.children_price === 0
                  ? String(v.children_price)
                  : "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Giảm giá (%)</p>
              <p className="font-medium">
                {v.discount ?? v.discount === 0 ? String(v.discount) : "-"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Phương tiện</p>
              <div className="flex flex-wrap gap-2">
                {(v.transportation || []).length ? (
                  v.transportation.map((x, i) => (
                    <Badge key={`${x}-${i}`} variant="secondary">
                      {x}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Bao gồm</p>
              <div className="flex flex-wrap gap-2">
                {(v.services_included || []).length ? (
                  v.services_included.map((x, i) => (
                    <Badge key={`${x}-${i}`} variant="secondary">
                      {x}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Không bao gồm
              </p>
              <div className="flex flex-wrap gap-2">
                {(v.services_excluded || []).length ? (
                  v.services_excluded.map((x, i) => (
                    <Badge key={`${x}-${i}`} variant="secondary">
                      {x}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Lịch trình</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {itinerarySummary.length ? (
            itinerarySummary.map((d) => (
              <div
                key={d.day}
                className="p-3 rounded-lg border flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    Ngày {d.day}: {d.title || "(Chưa có tiêu đề)"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hoạt động: {d.activitiesCount} • Chỗ ở:{" "}
                    {d.hasAccommodation ? "Có" : "Không"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">-</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Chính sách</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Đặt cọc (%)</p>
            <p className="font-medium">{v.policy?.deposit_percent ?? "-"}</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="text-sm text-muted-foreground">Phí huỷ</p>
            <p className="font-medium">{v.policy?.cancellation_fee || "-"}</p>
          </div>

          <div className="space-y-1 md:col-span-3">
            <p className="text-sm text-muted-foreground">Hoàn tiền</p>
            <p className="font-medium">{v.policy?.refund_policy || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Hình ảnh</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Thumbnail</p>
            {thumbnailPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailPreview}
                alt="thumbnail"
                className="h-40 w-64 object-cover rounded-md border"
              />
            ) : (
              <p className="text-sm text-red-500">Chưa chọn thumbnail</p>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Gallery (preview tối đa 6 ảnh)
            </p>

            {imagePreviews.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {imagePreviews.map((x, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${x.name}-${idx}`}
                    src={x.url}
                    alt={x.name}
                    className="h-28 w-full object-cover rounded-md border"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-500">Chưa chọn ảnh gallery</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepReview;
