"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Image as ImageIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useAgencyService } from "@/services/agencyService";
import { AgencyResponse, UpdateAgency } from "@/types/agency";
import { formatDate } from "@/utils/formatDate";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const agencySchema = z.object({
  agency_name: z.string().min(1, "Vui lòng nhập tên đại lý"),
  email_agency: z
    .string()
    .min(1, "Vui lòng nhập email đại lý")
    .email("Email không hợp lệ"),
  address_agency: z.string().min(1, "Vui lòng nhập địa chỉ"),
  license_number: z.string().min(1, "Vui lòng nhập mã số giấy phép / MST"),
  hotline: z
    .string()
    .min(1, "Vui lòng nhập số hotline")
    .regex(/^[0-9]{10,11}$/, "Hotline phải là 10–11 số"),
  description: z.string().optional(),
});

type AgencyForm = z.infer<typeof agencySchema>;

const UpdateProfileAgency = () => {
  const router = useRouter();
  const { getInforAgency, updateInforAgency } = useAgencyService();
  const [inforAgency, setInforAgency] = useState<AgencyResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgencyForm>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      agency_name: "",
      email_agency: "",
      address_agency: "",
      license_number: "",
      hotline: "",
      description: "",
    },
  });

  // Lấy dữ liệu cũ và fill vào form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInforAgency();
        if (res.success && res.data) {
          const data = res.data;
          setInforAgency(data);

          reset({
            agency_name: data.agency_name ?? "",
            email_agency: data.email_agency ?? "",
            address_agency: data.address_agency ?? "",
            license_number: data.license_number ?? "",
            hotline: data.hotline ?? "",
            description: data.description ?? "",
          });
        } else {
          toast.error("Không lấy được thông tin đại lý");
        }
      } catch (err: any) {
        console.log("Lỗi server: ", err);
        toast.error("Lỗi server, vui lòng thử lại sau");
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (values: AgencyForm) => {
    try {
      const payload: UpdateAgency = {
        agency_name: values.agency_name,
        email_agency: values.email_agency,
        address_agency: values.address_agency,
        license_number: values.license_number,
        hotline: values.hotline,
        description: values.description,
      };

      const res = await updateInforAgency(payload);
      console.log("API update agency response: ", res);

      if (res.success) {
        toast.success("Cập nhật thông tin đại lý thành công!");
        router.push("/agency/dashboard/profile");
      } else {
        const msg =
          typeof res.error?.message === "string"
            ? res.error.message
            : "Cập nhật thất bại, vui lòng thử lại";
        toast.error(msg);
      }
    } catch (err: any) {
      console.error("Lỗi khi cập nhật: ", err);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 w-full rounded-xl bg-white"
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-5 bg-slate-50 p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center space-x-4">
          <img
            src={
              inforAgency?.avatar_url ||
              "https://i.pinimg.com/736x/44/73/6a/44736a96000a98b6605890266305dd4c.jpg"
            }
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-gray-100 object-cover shadow"
          />
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-gray-500">
                Tên đại lý
              </label>
              <Input
                {...register("agency_name")}
                placeholder="Nhập tên đại lý"
                className="mt-1 max-w-xs"
              />
              {errors.agency_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.agency_name.message}
                </p>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              Đại lý cấp cao của VietTravel
            </p>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
          {inforAgency?.status === "approved" ? (
            <Badge className="bg-green-100 text-green-700 px-4 py-1 text-sm rounded-full">
              Đã được phê duyệt
            </Badge>
          ) : (
            <Badge className="bg-yellow-300 text-red-500 px-4 py-1 text-sm rounded-full">
              Đang chờ phê duyệt
            </Badge>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/agency/dashboard/profile")}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Edit className="w-4 h-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Thông tin đại lý */}
        <Card className="rounded-xl shadow-md border border-gray-100 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Thông tin đại lý
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            {/* Email */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-sm">Email</span>
              </div>
              <Input
                type="email"
                {...register("email_agency")}
                placeholder="Nhập email đại lý"
              />
              {errors.email_agency && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email_agency.message}
                </p>
              )}
            </div>

            {/* Hotline */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-sm">Hotline</span>
              </div>
              <Input
                {...register("hotline")}
                placeholder="Nhập số điện thoại hotline"
              />
              {errors.hotline && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.hotline.message}
                </p>
              )}
            </div>

            {/* Địa chỉ */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-sm">Địa chỉ</span>
              </div>
              <Textarea
                {...register("address_agency")}
                placeholder="Nhập địa chỉ chi tiết"
                rows={2}
              />
              {errors.address_agency && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.address_agency.message}
                </p>
              )}
            </div>

            {/* License / MST */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-sm">
                  Mã số thuế / Giấy phép
                </span>
              </div>
              <Input
                {...register("license_number")}
                placeholder="Nhập mã số thuế hoặc số giấy phép kinh doanh"
              />
              {errors.license_number && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.license_number.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Người đại diện – chỉ hiển thị, không sửa */}
        <Card className="rounded-xl shadow-md border border-gray-100 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Người đại diện
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <div>
              <span className="font-semibold text-sm block mb-1">
                Họ tên người đại diện
              </span>
              <p className="px-3 py-2 bg-gray-100 rounded-md text-sm">
                {inforAgency?.representative_name ?? "Chưa cập nhật"}
              </p>
              <p className="text-xs text-gray-400 italic mt-1">
                Thông tin này không thể chỉnh sửa từ trang đại lý. Vui lòng liên
                hệ quản trị viên nếu cần thay đổi.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-sm">Ngày đăng ký</span>
              </div>
              <p className="text-sm text-gray-600">
                {inforAgency?.created_at
                  ? formatDate(inforAgency.created_at)
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Giới thiệu */}
      <Card className="mt-5 rounded-xl shadow-md border border-gray-100 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Giới thiệu về đại lý
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 leading-relaxed">
          <Textarea
            {...register("description")}
            placeholder="Giới thiệu ngắn gọn về đại lý, thế mạnh, dịch vụ cung cấp..."
            rows={4}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Giấy phép & Logo – avatar chỉ đọc */}
      <Card className="mt-5 rounded-xl shadow-md border border-gray-100 bg-slate-50 mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Giấy phép & Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 text-gray-700 items-center">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2 w-full">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-sm">
                Logo / Avatar đại lý
              </span>
            </div>
            <div className="mt-3 flex justify-center md:justify-start w-full">
              <img
                src={
                  inforAgency?.license_url ||
                  "https://i.pinimg.com/736x/44/73/6a/44736a96000a98b6605890266305dd4c.jpg"
                }
                alt="Giấy phép kinh doanh"
                className="w-48 h-24 object-contain border rounded-xl p-3 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-400 italic">
              Logo hiện tại không thể chỉnh sửa tại đây. Vui lòng liên hệ quản
              trị viên nếu cần thay đổi.
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Số giấy phép / MST:</strong>{" "}
              {inforAgency?.license_number || "Chưa cập nhật"}
            </p>
            <p className="text-xs text-gray-400">
              Nếu thông tin giấy phép thay đổi, bạn có thể cập nhật mã số ở phần
              bên trái và cung cấp giấy tờ liên quan khi được yêu cầu.
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default UpdateProfileAgency;
