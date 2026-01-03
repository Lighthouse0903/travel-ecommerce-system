"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterAgencyFormValues } from "@/types/agency";

const StepLegal = () => {
  const { control, watch } = useFormContext<RegisterAgencyFormValues>();

  const agencyType = watch("agency_type") || "business";
  const isBusiness = agencyType === "business";

  return (
    <div className="space-y-5">
      <FormField
        control={control}
        name="license_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Số giấy phép kinh doanh <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="VD: 1221XXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="legal_representative_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Người đại diện pháp luật <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="VD: Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="legal_id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Số CCCD/CMND <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="VD: 0342XXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {isBusiness && (
        <FormField
          control={control}
          name="tax_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mã số thuế <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="VD: 10000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {!isBusiness && (
        <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          Bạn chọn <b>Cá nhân</b> nên <b>không bắt buộc</b> mã số thuế.
        </div>
      )}
    </div>
  );
};

export default StepLegal;
