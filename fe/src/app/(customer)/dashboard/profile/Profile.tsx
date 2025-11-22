"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/utils/formatDate";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Profile = () => {
  const { user } = useAuth();

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  if (!user) {
    return (
      <div className="w-full overflow-hidden">
        <motion.div {...fadeUp}>
          <Card className="shadow">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-1/4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 flex-1" />
                </div>
              ))}
              <Skeleton className="h-9 w-40 mt-4" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <motion.div {...fadeUp}>
        <div className="p-4 w-full space-y-6">
          <h1 className="text-2xl font-semibold">Thông tin cá nhân</h1>

          <Card className="shadow-sm border">
            <VisuallyHidden>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
            </VisuallyHidden>

            <CardContent className="space-y-4 text-sm p-5">
              <div className="grid grid-cols-1 gap-y-4">
                <p>
                  <b>Họ tên:</b> {user.full_name || "-"}
                </p>
                <p>
                  <b>Tên người dùng:</b> {user.username}
                </p>
                <p>
                  <b>Email:</b> {user.email}
                </p>
                <p>
                  <b>Địa chỉ:</b> {user.address || "-"}
                </p>
                <p>
                  <b>Ngày sinh:</b> {formatDate(user.date_of_birth)}
                </p>
                <p>
                  <b>Số điện thoại:</b> {user.phone || "-"}
                </p>
              </div>

              <Link href="/dashboard/edit_profile">
                <Button className="mt-4">Chỉnh sửa hồ sơ</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
