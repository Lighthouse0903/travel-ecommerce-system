"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthService } from "@/services/authService";

const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(6, "Mật khẩu hiện tại phải ít nhất 6 ký tự"),
    new_password: z.string().min(6, "Mật khẩu mới phải ít nhất 6 ký tự"),
    confirm_password: z.string().min(6, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { change_password } = useAuthService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = passwordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      toast.dismiss();
      toast.error("Vui lòng kiểm tra lại thông tin");
      setLoading(false);
      return;
    }
    const reset_password = {
      current_password: formData.current_password,
      new_password: formData.new_password,
    };

    console.log("Thông tin đổi mật khẩu:", reset_password);
    const res = await change_password(reset_password);
    console.log(res);
    toast.dismiss();
    if (res.success) {
      toast.success(
        typeof res.message === "string"
          ? res.message
          : "Đổi mật khẩu thành công"
      );
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } else {
      toast.error(
        typeof res.error === "string" ? res.error : "Đổi mật khẩu thất bại"
      );
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setErrors({});
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mật khẩu hiện tại */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Mật khẩu hiện tại
              </label>
              <Input
                name="current_password"
                type="password"
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
              />
              {errors.current_password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.current_password}
                </p>
              )}
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Mật khẩu mới
              </label>
              <Input
                name="new_password"
                type="password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
              />
              {errors.new_password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.new_password}
                </p>
              )}
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Xác nhận mật khẩu mới
              </label>
              <Input
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
              />
              {errors.confirm_password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Nút hành động */}
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

export default ChangePassword;
