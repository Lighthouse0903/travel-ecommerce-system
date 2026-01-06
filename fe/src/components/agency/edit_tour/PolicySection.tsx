"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import Section from "./Section";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { EditTourFormValues } from "@/types/tour";

const inputClass =
  "bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

const PolicySection: React.FC = () => {
  const { control } = useFormContext<EditTourFormValues>();

  return (
    <Section
      title="Chính sách"
      description="Thiết lập đặt cọc, phí huỷ và chính sách hoàn tiền."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* deposit_percent */}
        <FormField
          control={control}
          name="policy.deposit_percent"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Đặt cọc (%)</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  type="number"
                  min={0}
                  max={100}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* cancellation_fee */}
        <FormField
          control={control}
          name="policy.cancellation_fee"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-sm font-medium">Phí huỷ</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  placeholder="VD: Huỷ trước 7 ngày: 10% tổng giá trị..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* refund_policy */}
        <FormField
          control={control}
          name="policy.refund_policy"
          render={({ field }) => (
            <FormItem className="space-y-2 md:col-span-2">
              <FormLabel className="text-sm font-medium">
                Chính sách hoàn tiền
              </FormLabel>
              <FormControl>
                <Textarea
                  className={[inputClass, "min-h-[120px]"].join(" ")}
                  rows={4}
                  placeholder="Mô tả cách hoàn tiền, thời gian xử lý..."
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

export default PolicySection;
