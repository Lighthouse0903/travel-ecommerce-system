"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Save,
  ShieldCheck,
} from "lucide-react";

import type { AgencyProfile } from "@/types/agency";
import { formatDate } from "@/utils/formatDate";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  profile: AgencyProfile;
  isSubmitting: boolean;
  onCancel: () => void;
  formId: string;
}

const agencyTypeLabel = (t: AgencyProfile["agency_type"]) =>
  t === "business" ? "Doanh nghiệp" : "Cá nhân";

const EditProfileHeader: React.FC<Props> = ({
  profile,
  isSubmitting,
  onCancel,
  formId,
}) => {
  return (
    <Card className="rounded-xl bg-slate-50 shadow-md mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-muted">
              <Image
                src={
                  profile.avatar_url ||
                  "https://i.pinimg.com/1200x/6a/f1/ec/6af1ec6645410a41d5339508a83b86f9.jpg"
                }
                alt="Agency avatar"
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold truncate">
                Chỉnh sửa hồ sơ đại lý
              </h1>

              <p className="text-sm text-muted-foreground truncate">
                {profile.agency_name} • {agencyTypeLabel(profile.agency_type)}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <BadgeCheck className="mr-1 h-4 w-4" />
                  Đã xác nhận
                </Badge>

                <Badge variant="outline" className="gap-1">
                  <CalendarClock className="h-4 w-4" />
                  Cập nhật: {formatDate(profile.updated_at)}
                </Badge>

                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  Không sửa pháp lý
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Hủy
            </Button>

            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditProfileHeader;
