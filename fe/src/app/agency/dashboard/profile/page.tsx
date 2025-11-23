"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAgencyService } from "@/services/agencyService";
import { useEffect, useState } from "react";
import { AgencyResponse } from "@/types/agency";
import { formatDate } from "@/utils/formatDate";

export default function AgencyProfilePage() {
  const { getInforAgency } = useAgencyService();
  const [inforAgency, setInforAgency] = useState<AgencyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInforAgency();
        if (res.success) {
          setInforAgency(res.data);
          console.log("API get inforAgency response: ", res);
          setIsLoading(false);
        } else {
          setIsLoading(true);
          // console.log(typeof res.error=== "object"? )
        }
      } catch (err: any) {
        console.log("Lỗi server", err);
      }
    };
    fetchData();
  }, []);
  const router = useRouter();
  return (
    <div className="flex-1 w-full rounded-xl bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-5 bg-slate-50 p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center space-x-4">
          <img
            src="https://i.pinimg.com/736x/44/73/6a/44736a96000a98b6605890266305dd4c.jpg"
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-gray-100 object-cover shadow"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {inforAgency?.agency_name}
            </h1>
            <p className="text-gray-500">Đại lý cấp cao của VietTravel</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {inforAgency?.status === "approved" ? (
            <Badge className="bg-green-100 text-green-700 px-4 py-1 text-sm rounded-full">
              Đã được phê duyệt
            </Badge>
          ) : (
            <Badge className="bg-yellow-300 text-red-500 px-4 py-1 text-sm rounded-full">
              Đang chờ phê duyệt
            </Badge>
          )}

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
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="rounded-xl shadow-md border border-gray-100 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Thông tin đại lý
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <p>
                <strong>Email:</strong> {inforAgency?.email_agency}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <p>
                <strong>Địa chỉ:</strong> {inforAgency?.address_agency}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p>
                <strong>Mã số thuế:</strong> {inforAgency?.license_number}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border border-gray-100 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Người đại diện
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <div>
              <p>
                <strong>Họ tên:</strong>{" "}
                {inforAgency?.representative_name ?? "Phạm Văn Anh ??"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <p>
                <strong>Số điện thoại:</strong> {inforAgency?.hotline}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p>
                <strong>Ngày đăng ký:</strong>{" "}
                {formatDate(inforAgency?.created_at as string)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}

      <Card className="mt-5 rounded-xl shadow-md border border-gray-100 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Giới thiệu về đại lý
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 leading-relaxed">
          {inforAgency?.description ?? "Bạn chưa cập nhật thông tin này"}
        </CardContent>
      </Card>

      {/* License Section */}

      <Card className="mt-5 rounded-xl shadow-md border border-gray-100 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Giấy phép & Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 text-gray-700 items-center">
          <div className="flex justify-center md:justify-start">
            <img
              src={inforAgency?.avatar_url}
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
    </div>
  );
}
