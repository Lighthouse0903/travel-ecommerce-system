"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthService } from "@/services/authService";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ChangePassword, MessageResponse } from "@/types/auth";
import PasswordInput from "@/components/common/PasswordInput";

// Định nghĩa Schema cho form changepassword
const changePasswordSchema = z
  .object({
    current_password: z.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
    new_password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa (A-Z)")
      .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ thường (a-z)")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 số")
      .regex(/[^a-zA-Z0-9]/, "Phải chứa ít nhất 1 ký tự đặc biệt"),
    confirm_password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa (A-Z)")
      .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ thường (a-z)")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 số")
      .regex(/[^a-zA-Z0-9]/, "Phải chứa ít nhất 1 ký tự đặc biệt"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

const ChangePassword = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { change_password } = useAuthService();

  // Định nghĩa Form
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });
  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length === 0) return;

    const firstError = Object.values(errors)[0];
    if (firstError?.message) toast.error(String(firstError.message));
  }, [form.formState.errors]);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const onSubmit = async (values: ChangePassword) => {
    if (loading) return;
    setLoading(true);
    toast.dismiss();

    const payload: ChangePassword = {
      current_password: values.current_password,
      new_password: values.new_password,
    };

    try {
      const res = await change_password(payload);

      if (res.success) {
        const msg =
          (res.data as MessageResponse)?.message ||
          (typeof res.message === "string" ? res.message : "") ||
          "Đổi mật khẩu thành công.";

        toast.success(msg);

        router.push("/dashboard/profile");
        form.reset();
      } else {
        const firstMsg = res.error?.errors
          ? Object.values(res.error.errors).flat()[0]
          : res.message;

        toast.error(
          typeof firstMsg === "string" && firstMsg.trim()
            ? firstMsg
            : "Đổi mật khẩu thất bại."
        );
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
  };
  if (!user) {
    return (
      <div className="w-full overflow-hidden">
        <motion.div {...fadeUp}>
          <div className="p-4 w-full space-y-6">
            <Breadcrumb>
              <BreadcrumbList className="text-base md:text-lg">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/profile">
                    Tổng quan
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Đổi mật khẩu</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

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
          <Breadcrumb>
            <BreadcrumbList className="text-base md:text-lg">
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/profile">
                  Thông tin cá nhân
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Đổi mật khẩu</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Card className="shadow-sm border">
            <VisuallyHidden>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
              </CardHeader>
            </VisuallyHidden>

            <CardContent className="space-y-4 text-sm p-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="current-password"
                            placeholder="Nhập mật khẩu hiện tại"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="new-password"
                            placeholder="Nhập mật khẩu mới"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="new-password"
                            placeholder="Nhập lại mật khẩu mới"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={!form.formState.isValid || loading}
                    >
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
              </Form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
