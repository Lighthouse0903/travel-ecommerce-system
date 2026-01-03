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

const PolicySection: React.FC = () => {
  const { control } = useFormContext<EditTourFormValues>();

  return (
    <Section
      title="Chính sách"
      description="Thiết lập đặt cọc, phí huỷ và chính sách hoàn tiền."
    >
      <div className="space-y-4">
        {/* deposit_percent */}
        <FormField
          control={control}
          name="policy.deposit_percent"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Đặt cọc (%)</FormLabel>
              <FormControl>
                <Input
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
            <FormItem className="space-y-2">
              <FormLabel>Phí huỷ</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: Huỷ trước 7 ngày: 10% tổng giá trị..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
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
            <FormItem className="space-y-2">
              <FormLabel>Chính sách hoàn tiền</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Mô tả cách hoàn tiền, thời gian xử lý..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
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
