"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthService } from "@/services/authService";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { change_password } = useAuthService();

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
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

    const payload = {
      current_password: formData.current_password,
      new_password: formData.new_password,
    };

    try {
      toast.dismiss();
      const res = await change_password(payload);
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
        setErrors({});
      } else {
        toast.error(
          typeof res.message === "string"
            ? res.message
            : "Đổi mật khẩu thất bại"
        );
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setErrors({});
  };

  if (!user) {
    return (
      <div className="w-full overflow-hidden">
        <motion.div {...fadeUp}>
          <div className="p-4 w-full space-y-6">
            <h1 className="text-2xl font-semibold">Đổi mật khẩu</h1>

            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-1/3" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <motion.div {...fadeUp}>
        <div className="p-4 w-full space-y-6">
          <h1 className="text-2xl font-semibold">Đổi mật khẩu</h1>

          <Card className="shadow-sm border">
            <VisuallyHidden>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
              </CardHeader>
            </VisuallyHidden>

            <CardContent className="space-y-4 text-sm p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
