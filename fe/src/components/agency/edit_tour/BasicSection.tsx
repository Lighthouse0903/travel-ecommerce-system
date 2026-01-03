"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import Section from "./Section";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CATEGORY_CHOICES, EditTourFormValues } from "@/types/tour";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

const regionOptions = [
  { value: 1, label: "Miền Bắc" },
  { value: 2, label: "Miền Trung" },
  { value: 3, label: "Miền Nam" },
];

const BasicSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext<EditTourFormValues>();

  const selectedCategories = watch("categories") ?? [];

  const toggleCategory = (value: string) => {
    const next = selectedCategories.includes(value)
      ? selectedCategories.filter((x) => x !== value)
      : [...selectedCategories, value];

    setValue("categories", next, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Section
      title="Thông tin cơ bản"
      description="Cập nhật các thông tin chính của tour."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tên tour */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel>Tên tour</FormLabel>
              <FormControl>
                <Input placeholder="VD: Hà Nội - Ninh Bình 2N1Đ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nơi khởi hành */}
        <FormField
          control={control}
          name="departure_location"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Nơi khởi hành</FormLabel>
              <FormControl>
                <Input placeholder="VD: Hà Nội" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Điểm đến */}
        <FormField
          control={control}
          name="destination"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Điểm đến</FormLabel>
              <FormControl>
                <Input placeholder="VD: Ninh Bình" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Số ngày */}
        <FormField
          control={control}
          name="duration_days"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Số ngày</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  value={field.value ?? 1}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Miền */}
        <FormField
          control={control}
          name="region"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Vùng miền</FormLabel>
              <FormControl>
                <Select
                  value={String(field.value ?? 1)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vùng miền" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Danh mục */}
        <FormField
          control={control}
          name="categories"
          render={() => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel>Danh mục</FormLabel>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CATEGORY_CHOICES.map((c) => {
                  const checked = selectedCategories.includes(c.value);
                  return (
                    <label
                      key={c.value}
                      className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleCategory(c.value)}
                      />
                      <span className="text-sm">{c.label}</span>
                    </label>
                  );
                })}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mô tả */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Mô tả ngắn về tour..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Section>
  );
};

export default BasicSection;
