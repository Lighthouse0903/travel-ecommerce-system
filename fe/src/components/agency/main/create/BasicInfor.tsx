"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import PickupPointsSection from "./PickupPointsSection";
import { CATEGORY_CHOICES } from "@/types/tour";

const BasicInfor = () => {
  const { register, setValue, watch } = useFormContext();
  const region = watch("region");
  const selectedCategories: string[] = watch("categories") || [];

  const toggleCategory = (value: string) => {
    const current = new Set(selectedCategories);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    setValue("categories", Array.from(current), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-5">
      {/* Thông tin cơ bản */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tên tour — full width row */}
          <div className="md:col-span-2 flex flex-col gap-1">
            <Label htmlFor="name">Tên tour</Label>
            <Input
              id="name"
              placeholder="VD: Tour Đà Lạt 3N2Đ - Săn mây & Hoa dã quỳ"
              {...register("name")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="duration_days">Số ngày tour</Label>
            <Input
              id="duration_days"
              type="number"
              min={1}
              {...register("duration_days", { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="adult_price">Giá người lớn (VNĐ)</Label>
            <Input
              id="adult_price"
              type="text"
              inputMode="decimal"
              pattern="^\d+(\.\d{1,2})?$"
              placeholder="Ví dụ: 1299000 hoặc 1299000.50"
              {...register("adult_price")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="children_price">Giá trẻ em (VNĐ)</Label>
            <Input
              id="children_price"
              type="text"
              inputMode="decimal"
              pattern="^\d+(\.\d{1,2})?$"
              placeholder="Ví dụ: 1299000 hoặc 1299000.50"
              {...register("children_price")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="discount">Giá khuyến mãi (%)</Label>
            <Input
              id="discount"
              type="text"
              inputMode="decimal"
              pattern="^\d+(\.\d{1,2})?$"
              placeholder="Trong phạm vi từ 0 đến 100"
              {...register("discount")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Thông tin địa điểm */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Thông tin địa điểm
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="start_location">Điểm khởi hành</Label>
            <Input
              id="start_location"
              placeholder="VD: TP. Hồ Chí Minh"
              {...register("start_location")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="end_location">Điểm kết thúc</Label>
            <Input
              id="end_location"
              placeholder="VD: Hà Nội"
              {...register("end_location")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="destination">Điểm đến chính</Label>
            <Input
              id="destination"
              placeholder="VD: Hạ Long, Đà Lạt..."
              {...register("destination")}
            />
          </div>
        </CardContent>

        {/*  Điểm đón khách */}
        <CardContent>
          <Label className="font-medium text-gray-700 mb-2">
            Điểm đón khách
          </Label>

          {/* Danh sách các pickup point */}
          <PickupPointsSection />
        </CardContent>
      </Card>

      {/* Phân loại và mô tả */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Phân loại & Mô tả
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Khu vực */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="region">Khu vực</Label>
            <Select
              onValueChange={(value) =>
                setValue("region", Number(value), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              value={region ? String(region) : ""}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Miền Bắc</SelectItem>
                <SelectItem value="2">Miền Trung</SelectItem>
                <SelectItem value="3">Miền Nam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Danh mục (multi select) */}
          <div className="flex flex-col gap-1">
            <Label>Danh mục</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-between w-full",
                    selectedCategories.length === 0 && "text-muted-foreground"
                  )}
                >
                  {selectedCategories.length > 0
                    ? CATEGORY_CHOICES.filter((c) =>
                        selectedCategories.includes(c.value)
                      )
                        .map((c) => c.label)
                        .join(", ")
                    : "Chọn danh mục..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-2">
                <div className="space-y-1">
                  {CATEGORY_CHOICES.map((cat) => (
                    <div
                      key={cat.value}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(cat.value)}
                        onCheckedChange={() => toggleCategory(cat.value)}
                      />
                      <span className="text-sm">{cat.label}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn về tour, các điểm nổi bật, dịch vụ..."
              rows={5}
              {...register("description")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfor;
