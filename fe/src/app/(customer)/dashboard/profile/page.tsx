"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { formatDateOnly } from "@/utils/formatDate";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { toast } from "sonner";
import { useEffect } from "react";
import { SquarePen } from "lucide-react";
import ProfileSkeleton from "./ProfileSkeleton";

const Profile = () => {
  const { user, loading } = useAuth();
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    if (!loading && !user) {
      toast.dismiss();
      toast.warning("Bạn chưa đăng nhập");
      openLoginModal();
    }
  }, [loading, user, openLoginModal]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) return null;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-900">
            Thông tin cá nhân
          </h1>
          <p className="text-sm text-slate-600">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>
        <Link href="/dashboard/edit_profile">
          <Button className="mt-2">
            <SquarePen className="mr-2 h-4 w-4" />
            <span>Chỉnh sửa hồ sơ</span>
          </Button>
        </Link>
      </div>

      <Card className="border-none bg-sky-50 shadow-sm">
        <VisuallyHidden>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
        </VisuallyHidden>

        <CardContent className="space-y-5 p-5 text-sm">
          <div className="grid grid-cols-1 gap-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Họ tên</span>
              <span className="font-medium text-slate-900">
                {user.full_name || "-"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Tên người dùng</span>
              <span className="font-medium text-slate-900">
                {user.username}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Email</span>
              <span className="font-medium text-slate-900 break-all">
                {user.email}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Địa chỉ</span>
              <span className="font-medium text-slate-900">
                {user.address || "-"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Ngày sinh</span>
              <span className="font-medium text-slate-900">
                {formatDateOnly(user.date_of_birth ?? "")}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Số điện thoại</span>
              <span className="font-medium text-slate-900">
                {user.phone || "-"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
