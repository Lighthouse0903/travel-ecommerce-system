"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AgencyProfilePage() {
  const router = useRouter();
  return (
    <main className="flex-1 w-full rounded-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-slate-50 p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <img
            src="https://i.pinimg.com/736x/44/73/6a/44736a96000a98b6605890266305dd4c.jpg"
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-gray-100 object-cover shadow"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              VietTravel Partner Co., Ltd
            </h1>
            <p className="text-gray-500">Đại lý cấp cao của VietTravel</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Badge className="bg-green-100 text-green-700 px-4 py-1 text-sm rounded-full">
            Đã duyệt
          </Badge>
          <Button
            onClick={() => {
              router.push("/agency/dashboard/update_profile");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa hồ sơ
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Thông tin đại lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <p>
                  <strong>Email:</strong> agency@viettravel.vn
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p>
                  <strong>Địa chỉ:</strong> 180 Pasteur, Quận 3, TP. Hồ Chí Minh
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p>
                  <strong>Mã đại lý:</strong> AGY-00214
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Người đại diện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <div>
                <p>
                  <strong>Họ tên:</strong> Phạm Văn Anh
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <p>
                  <strong>Số điện thoại:</strong> (+84) 912 345 678
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p>
                  <strong>Ngày đăng ký:</strong> 26/12/2023
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}>
        <Card className="mt-8 rounded-xl shadow-sm border border-gray-100 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Giới thiệu về đại lý
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 leading-relaxed">
            VietTravel Partner Co., Ltd là một đối tác du lịch uy tín chuyên
            cung cấp các tour trong nước và quốc tế với hơn 10 năm kinh nghiệm.
            Chúng tôi luôn hướng đến trải nghiệm khách hàng tốt nhất, đồng hành
            cùng hệ thống VietTravel trong việc phát triển ngành du lịch Việt
            Nam.
          </CardContent>
        </Card>
      </motion.div>

      {/* License Section */}
      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}>
        <Card className="mt-8 rounded-xl shadow-sm border border-gray-100 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Giấy phép & Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 text-gray-700 items-center">
            <div className="flex justify-center md:justify-start">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Vietravel_logo.svg/512px-Vietravel_logo.svg.png"
                alt="logo đại lý"
                className="w-48 h-24 object-contain border rounded-xl p-3 bg-gray-50"
              />
            </div>
            <div>
              <p>
                <strong>Số giấy phép:</strong> 0302847724
              </p>
              <p>
                <strong>Ngày cấp:</strong> 15/03/2015
              </p>
              <p>
                <strong>Cơ quan cấp:</strong> Sở KH&ĐT TP. Hồ Chí Minh
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
