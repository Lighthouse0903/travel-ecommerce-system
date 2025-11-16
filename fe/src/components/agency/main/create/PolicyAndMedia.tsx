"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import FileUpload from "@/components/common/Upload/FileUpload";

const PolicyAndMedia = () => {
  const { register, setValue, watch } = useFormContext();

  // chỉ còn images theo type đã thống nhất
  const images = (watch("images") as File[]) || [];

  return (
    <div className="space-y-6">
      {/* Chính sách */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Chính sách</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="policy.deposit_percent">
              Phần trăm đặt cọc (%)
            </Label>
            <Input
              id="policy.deposit_percent"
              type="number"
              min={0}
              max={100}
              // BE yêu cầu 0..100
              {...register("policy.deposit_percent", { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="policy.cancellation_fee">Phí huỷ tour</Label>
            <Textarea
              id="policy.cancellation_fee"
              placeholder="VD: Huỷ trước 7 ngày mất 30%, huỷ trước 3 ngày mất 70%..."
              {...register("policy.cancellation_fee")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="policy.refund_policy">Chính sách hoàn tiền</Label>
            <Textarea
              id="policy.refund_policy"
              placeholder="VD: Hoàn 100% nếu huỷ trong vòng 24h..."
              {...register("policy.refund_policy")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hình ảnh */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Hình ảnh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload
            label="Hình ảnh tour (có thể chọn nhiều)"
            type="image"
            value={images}
            onChange={(files) =>
              setValue("images", files, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          {/* gợi ý nhỏ: hiển thị tổng số ảnh */}
          <p className="text-sm text-muted-foreground">
            Đã chọn {images.length} ảnh
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyAndMedia;
