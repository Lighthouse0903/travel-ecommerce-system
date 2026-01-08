"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import type { TourRequest } from "@/types/tour";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { cn } from "@/lib/utils";
import { CATEGORY_CHOICES } from "@/types/tour";
const inputClass =
  "bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

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
      <Card className="p-0">
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
                    className={inputClass}
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
                    className={inputClass}
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
                  <Input
                    placeholder="VD: Hà Nội"
                    {...field}
                    className={inputClass}
                  />
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
                  <Input
                    placeholder="VD: Mộc Châu"
                    {...field}
                    className={inputClass}
                  />
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
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem className={inputClass} value="1">
                      Miền Bắc
                    </SelectItem>
                    <SelectItem className={inputClass} value="2">
                      Miền Trung
                    </SelectItem>
                    <SelectItem className={inputClass} value="3">
                      Miền Nam
                    </SelectItem>
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
              <FormItem className="space-y-2">
                <FormLabel>Danh mục</FormLabel>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {CATEGORY_CHOICES.map((c) => {
                    const checked = selectedCategories.includes(c.value);

                    return (
                      <div key={c.value} className="relative">
                        <input
                          id={`cat-${c.value}`}
                          type="checkbox"
                          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          checked={checked}
                          onChange={() => toggleCategory(c.value)}
                        />

                        <label
                          htmlFor={`cat-${c.value}`}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2 transition",
                            "bg-background border-border cursor-pointer",
                            "hover:bg-muted/40",
                            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20",
                            checked
                              ? "border-primary/40 bg-primary/5"
                              : "text-foreground"
                          )}
                        >
                          {/* Checkbox shadcn chỉ để hiển thị (không toggle để tránh gọi 2 lần) */}
                          <Checkbox
                            checked={checked}
                            onClick={(e) => e.stopPropagation()}
                            className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                          />
                          <span className="text-sm">{c.label}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  Chọn một hoặc nhiều danh mục phù hợp để tour dễ được tìm thấy.
                </p>

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
