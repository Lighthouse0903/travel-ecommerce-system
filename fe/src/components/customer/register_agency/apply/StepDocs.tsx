"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RegisterAgencyFormValues } from "@/types/agency";
import FileUpload from "@/components/common/Upload/FileUpload";

const StepDocs = () => {
  const { control } = useFormContext<RegisterAgencyFormValues>();

  return (
    <div className="space-y-5">
      <FormField
        control={control}
        name="license_file"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Giấy phép kinh doanh <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <FileUpload
                value={field.value ?? null}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="legal_id_front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                CCCD/CMND mặt trước <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value ?? null}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="legal_id_back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                CCCD/CMND mặt sau <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value ?? null}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="avatar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Avatar (tuỳ chọn)</FormLabel>
            <FormControl>
              <FileUpload
                value={field.value ?? null}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        Tip: Nếu giấy phép là PDF thì vẫn chọn được, review sẽ hiện tên file.
      </div>
    </div>
  );
};

export default StepDocs;
