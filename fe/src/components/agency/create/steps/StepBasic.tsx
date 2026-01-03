"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import type { TourRequest } from "@/types/tour";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

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

import { cn } from "@/lib/utils";
import { CATEGORY_CHOICES } from "@/types/tour";

const StepBasic: React.FC = () => {
  const { control, watch, setValue, clearErrors } =
    useFormContext<TourRequest>();

  const selectedCategories = (watch("categories") || []) as string[];

  const toggleCategory = (value: string) => {
    const set = new Set(selectedCategories);
    set.has(value) ? set.delete(value) : set.add(value);

    setValue("categories", Array.from(set), {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors("categories");
  };

  return (
    <div className="space-y-5">
      {/* Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Tên tour</FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Tour Đà Lạt 3N2Đ - Săn mây & Hoa dã quỳ"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="duration_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số ngày tour</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value ?? 1}
                    onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value || 1));
                      field.onChange(v);
                      clearErrors("duration_days");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Địa điểm */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin địa điểm</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="departure_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nơi khởi hành</FormLabel>
                <FormControl>
                  <Input placeholder="VD: Hà Nội" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm đến</FormLabel>
                <FormControl>
                  <Input placeholder="VD: Mộc Châu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Phân loại & mô tả */}
      <Card>
        <CardHeader>
          <CardTitle>Phân loại & Mô tả</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khu vực</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => {
                    field.onChange(Number(v));
                    clearErrors("region");
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Miền Bắc</SelectItem>
                    <SelectItem value="2">Miền Trung</SelectItem>
                    <SelectItem value="3">Miền Nam</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="categories"
            render={() => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-between",
                        selectedCategories.length === 0 &&
                          "text-muted-foreground"
                      )}
                    >
                      {selectedCategories.length
                        ? CATEGORY_CHOICES.filter((c) =>
                            selectedCategories.includes(c.value)
                          )
                            .map((c) => c.label)
                            .join(", ")
                        : "Chọn danh mục..."}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[260px] p-2">
                    {CATEGORY_CHOICES.map((cat) => (
                      <div
                        key={cat.value}
                        className="flex items-center gap-2 py-1"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(cat.value)}
                          onCheckedChange={() => toggleCategory(cat.value)}
                        />
                        <span className="text-sm">{cat.label}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả chi tiết</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StepBasic;
