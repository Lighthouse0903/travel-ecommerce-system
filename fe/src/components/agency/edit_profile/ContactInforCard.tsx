"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { EditAgencyFormValues } from "@/types/agency";

interface Props {
  isSubmitting: boolean;
}

const ContactInforCard: React.FC<Props> = ({ isSubmitting }) => {
  const { control } = useFormContext<EditAgencyFormValues>();

  return (
    <Card className="rounded-xl bg-slate-50 shadow-md">
      <CardHeader>
        <CardTitle>Thông tin liên hệ</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="email_agency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
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
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Hotline
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address_agency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Địa chỉ
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        <p className="text-xs text-muted-foreground">
          * Không thể đổi tên đại lý / thông tin pháp lý tại trang này.
        </p>
      </CardContent>
    </Card>
  );
};

export default ContactInforCard;
