"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useAuthService } from "@/services/authService";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

import type { UpdateProfile, UserResponse } from "@/types/user";

const editProfileSchema = z.object({
  username: z
    .string()
    .min(2, "Tên đăng nhập phải có ít nhất 2 kí tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Username không được chứa ký tự đặc biệt"),
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^(0|\+84)[0-9]{9}$/.test(val), {
      message: "Số điện thoại không hợp lệ",
    }),
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "Địa chỉ phải có ít nhất 5 ký tự",
    }),
  date_of_birth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ngày sinh không hợp lệ",
    }),
});

const EditProfile = () => {
  const router = useRouter();
  const { update } = useAuthService();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Định nghĩa form
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: "",
      full_name: "",
      phone: "",
      address: "",
      date_of_birth: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      username: user.username ?? "",
      full_name: user.full_name ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
      date_of_birth: user.date_of_birth ?? "",
    });
  }, [user, form]);

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

  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    toast.dismiss();
    if (!user) return;

    const payload: UpdateProfile = {};
    (Object.keys(values) as (keyof typeof values)[]).forEach((key) => {
      if ((user as UserResponse)[key] !== values[key]) {
        payload[key] = values[key];
      }
    });

    if (Object.keys(payload).length === 0) {
      toast.message("Không có thay đổi nào");
      return;
    }

    setLoading(true);
    try {
      const res = await update(payload);

      if (res.success) {
        toast.success(res.message || "Cập nhật hồ sơ thành công");
        setUser(res.data);
        router.push("/dashboard/profile");
        return;
      }

      const firstMsg = res.error?.errors
        ? Object.values(res.error.errors).flat()[0]
        : res.message;

      toast.error(firstMsg || res.message || "Cập nhật thất bại");
    } catch {
      toast.error("Lỗi hệ thống, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    form.reset({
      username: user.username ?? "",
      full_name: user.full_name ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
      date_of_birth: user.date_of_birth ?? "",
    });
  };

  if (!user) {
    return (
      <div className="p-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="space-y-4 p-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <motion.div {...fadeUp}>
        <div className="p-4 space-y-6">
          <Breadcrumb>
            <BreadcrumbList className="text-base md:text-lg">
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/profile">
                  Thông tin cá nhân
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cập nhật thông tin cá nhân</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card className="border shadow-sm">
            <VisuallyHidden>
              <CardHeader>
                <CardTitle>Cập nhật hồ sơ</CardTitle>
              </CardHeader>
            </VisuallyHidden>

            <CardContent className="p-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
              </Form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfile;
