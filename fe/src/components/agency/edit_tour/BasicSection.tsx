"use client";

import React, { useId } from "react";
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

const inputClass =
  "bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

const BasicSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext<EditTourFormValues>();
  const uid = useId();

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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Tên tour */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-sm font-medium">Tên tour</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  placeholder="VD: Hà Nội - Ninh Bình 2N1Đ"
                  {...field}
                  value={field.value ?? ""}
                />
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
              <FormLabel className="text-sm font-medium">
                Nơi khởi hành
              </FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  placeholder="VD: Hà Nội"
                  {...field}
                  value={field.value ?? ""}
                />
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
              <FormLabel className="text-sm font-medium">Điểm đến</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  placeholder="VD: Ninh Bình"
                  {...field}
                  value={field.value ?? ""}
                />
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
              <FormLabel className="text-sm font-medium">Số ngày</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
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
              <FormLabel className="text-sm font-medium">Vùng miền</FormLabel>
              <FormControl>
                <Select
                  value={String(field.value ?? 1)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className={inputClass}>
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
              <FormLabel className="text-sm font-medium">Danh mục</FormLabel>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {CATEGORY_CHOICES.map((c) => {
                  const checked = selectedCategories.includes(c.value);
                  const checkboxId = `${uid}-${c.value}`;

                  return (
                    <div key={c.value} className="relative">
                      <input
                        id={checkboxId}
                        type="checkbox"
                        className="peer sr-only"
                        checked={checked}
                        onChange={() => toggleCategory(c.value)}
                      />

                      <label
                        htmlFor={checkboxId}
                        className={[
                          "flex items-center gap-2 rounded-lg border px-3 py-2 transition",
                          "bg-background border-border cursor-pointer",
                          "hover:bg-muted/40",
                          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 peer-focus-visible:ring-offset-0",
                          checked
                            ? "border-primary/40 bg-primary/5"
                            : "text-foreground",
                        ].join(" ")}
                      >
                        {/* vẫn dùng Checkbox của shadcn để đồng bộ UI */}
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleCategory(c.value)}
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

        {/* Mô tả */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  className={[inputClass, "min-h-[120px]"].join(" ")}
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
