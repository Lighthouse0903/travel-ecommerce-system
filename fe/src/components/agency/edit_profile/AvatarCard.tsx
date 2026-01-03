"use client";

import React from "react";
import { Upload } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import FileUpload from "@/components/common/Upload/FileUpload";
import { EditAgencyFormValues } from "@/app/agency/dashboard/edit_profile/formSchema";

interface Props {
  isSubmitting: boolean;
}

const AvatarCard: React.FC<Props> = ({ isSubmitting }) => {
  const { control } = useFormContext<EditAgencyFormValues>();

  return (
    <Card className="rounded-xl bg-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Logo/Avatar
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Bạn chỉ có thể cập nhật logo/ảnh đại diện và thông tin vận hành. Thông
          tin pháp lý không thay đổi tại đây.
        </p>

        <FormField
          control={control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chọn ảnh mới</FormLabel>
              <FormControl>
                <div
                  className={
                    isSubmitting ? "pointer-events-none opacity-70" : ""
                  }
                >
                  <FileUpload
                    value={field.value ?? null}
                    onChange={(file) => field.onChange(file)}
                    className="h-44"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AvatarCard;
