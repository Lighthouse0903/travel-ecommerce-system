"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, XCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useAgencyProfile } from "@/contexts/AgencyProfileContext";

export default function RegisterAgencyStatusPage() {
  const router = useRouter();
  const { loading, profile, refresh } = useAgencyProfile();

  // chưa đăng ký thì không cho vào status
  useEffect(() => {
    if (loading) return;

    if (!profile) {
      router.replace("/dashboard/register_agency/terms");
      return;
    }

    if (profile.status === "approved") {
      router.replace("/agency/dashboard");
      return;
    }
  }, [loading, profile, router]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Đang tải trạng thái hồ sơ...
      </div>
    );
  }

  if (!profile) return null;

  const isPending = profile.status === "pending";
  const isRejected = profile.status === "rejected";

  return (
    <div className="mx-auto w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
      >
        <Breadcrumb>
          <BreadcrumbList className="text-base md:text-lg">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Tổng quan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Trạng thái hồ sơ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Trạng thái đăng ký đại lý
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Theo dõi tiến trình xét duyệt hồ sơ của bạn
            </p>
          </div>

          {isPending && (
            <Badge className="bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
              ĐANG CHỜ DUYỆT
            </Badge>
          )}

          {isRejected && (
            <Badge className="bg-red-500/15 text-red-400 ring-1 ring-red-500/30">
              BỊ TỪ CHỐI
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-muted">
                {isPending ? (
                  <Clock className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
              </div>
              <div>
                <CardTitle>
                  {isPending
                    ? "Hồ sơ đang được xét duyệt"
                    : "Hồ sơ chưa đạt yêu cầu"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isPending
                    ? "Vui lòng chờ admin kiểm tra và phê duyệt hồ sơ."
                    : "Bạn có thể chỉnh sửa thông tin và nộp lại hồ sơ."}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <Separator />

            {isPending && (
              <div className="rounded-2xl bg-muted/40 p-4 space-y-2">
                <p className="text-sm">
                  ⏳ Thời gian xử lý dự kiến:{" "}
                  <span className="font-medium">24–48 giờ</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Trạng thái sẽ tự động cập nhật khi admin hoàn tất xét duyệt.
                </p>

                <div className="pt-2">
                  <Button variant="outline" onClick={refresh}>
                    Làm mới trạng thái
                  </Button>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="rounded-2xl bg-muted/40 p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium">Lý do từ chối</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.reason_rejected || "Không có lý do cụ thể."}
                  </p>
                </div>

                <Button
                  className="gap-2"
                  onClick={() =>
                    router.push("/dashboard/register_agency/apply")
                  }
                >
                  <FileText className="h-4 w-4" />
                  Nộp lại hồ sơ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Cập nhật gần nhất:{" "}
          {new Date(profile.updated_at || profile.created_at).toLocaleString(
            "vi-VN"
          )}
        </p>
      </motion.div>
    </div>
  );
}
