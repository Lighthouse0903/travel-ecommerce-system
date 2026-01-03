"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { EditAgencyFormValues } from "@/app/agency/dashboard/edit_profile/formSchema";

interface Props {
  isSubmitting: boolean;
}

const AboutFormCard: React.FC<Props> = ({ isSubmitting }) => {
  const { control } = useFormContext<EditAgencyFormValues>();

  return (
    <Card className="rounded-xl bg-slate-50 shadow-md">
      <CardHeader>
        <CardTitle>Giới thiệu</CardTitle>
      </CardHeader>

      <CardContent>
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  rows={10}
                  placeholder="Giới thiệu ngắn về đại lý, điểm mạnh, tuyến tour nổi bật..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AboutFormCard;
