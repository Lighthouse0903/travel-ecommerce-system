"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { RegisterAgencyFormValues } from "@/types/agency";

const StepBasic = () => {
  const { control, watch, setValue } =
    useFormContext<RegisterAgencyFormValues>();

  const agencyType = watch("agency_type") || "business";

  return (
    <div className="space-y-5">
      <FormField
        control={control}
        name="agency_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Tên đại lý <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="VD: VietTravel Agency" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="agency_type"
        render={() => (
          <FormItem>
            <FormLabel>
              Loại đại lý <span className="text-red-500">*</span>
            </FormLabel>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant={agencyType === "business" ? "default" : "outline"}
                onClick={() =>
                  setValue("agency_type", "business", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                Doanh nghiệp
              </Button>

              <Button
                type="button"
                variant={agencyType === "individual" ? "default" : "outline"}
                onClick={() =>
                  setValue("agency_type", "individual", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                Cá nhân
              </Button>

              <Badge variant="secondary">{agencyType}</Badge>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="email_agency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (tuỳ chọn)</FormLabel>
              <FormControl>
                <Input placeholder="VD: agency@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hotline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotline (tuỳ chọn)</FormLabel>
              <FormControl>
                <Input placeholder="VD: 09012345XX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="address_agency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Địa chỉ (tuỳ chọn)</FormLabel>
            <FormControl>
              <Input placeholder="VD: Ngọc Hồi, Thanh Trì, Hà Nội" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả (tuỳ chọn)</FormLabel>
            <FormControl>
              <Textarea placeholder="Giới thiệu ngắn về đại lý..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StepBasic;
