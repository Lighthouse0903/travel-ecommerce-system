"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useAuthService } from "@/services/authService";

const EditProfile = () => {
  const { update } = useAuthService();
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    date_of_birth: user?.date_of_birth || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Thông tin cập nhật: ", formData);
    try {
      setLoading(true);
      // gọi API cập nhật (chỉ gửi các trường có giá trị)
      const res = await update(formData);
      if (res.success) {
        console.log("Cập nhật thành công");
        toast.success("Cập nhật thành công!");
        setUser({ ...user, ...formData }); // cập nhật lại context
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      date_of_birth: user?.date_of_birth || "",
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Cập nhật hồ sơ</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Họ và tên
              </label>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày sinh
              </label>
              <Input
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EditProfile;
