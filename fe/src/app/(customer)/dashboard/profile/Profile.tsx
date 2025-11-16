"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { formatDateVN } from "@/utils/formatDate";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="w-full overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="shadow">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-1/4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-1/2" />
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
    <div className="w-full shadow-md overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <b>Họ tên:</b> {user.full_name}
            </p>
            <p>
              <b>Tên người dùng:</b> {user.username}
            </p>
            <p>
              <b>Email:</b> {user.email}
            </p>
            <p>
              <b>Địa chỉ:</b> {user.address}
            </p>
            <p>
              <b>Ngày sinh:</b> {formatDateVN(user.date_of_birth)}
            </p>
            <p>
              <b>Phone:</b> {user.phone}
            </p>

            <Link href="/dashboard/edit_profile">
              <Button className="mt-5">Chỉnh sửa hồ sơ</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
