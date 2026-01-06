"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/contexts/AuthContext";
import { useAuthService } from "@/services/authService";

import type { UpdateProfile, UserResponse } from "@/types/user";
import { EditProfileFormValues, editProfileSchema } from "@/schemas/user";

const inputClass =
  "bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

const EditProfile = () => {
  const router = useRouter();
  const { update } = useAuthService();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
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
    if (!errors || Object.keys(errors).length === 0) return;

    const firstError = Object.values(errors)[0];
    if (firstError?.message) toast.error(String(firstError.message));
  }, [form.formState.errors]);

  const onSubmit = async (values: EditProfileFormValues) => {
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
      <div className="bg-background p-4 md:p-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 md:p-6 border border-border rounded-xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cập nhật thông tin cá nhân
        </h1>
        <p className="text-sm text-muted-foreground">
          Chỉnh sửa thông tin tài khoản của bạn
        </p>
      </div>

      {/* Form Card */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Tên đăng nhập
                      </FormLabel>
                      <FormControl>
                        <Input className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <Input className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <Input className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Ngày sinh
                      </FormLabel>
                      <FormControl>
                        <Input className={inputClass} type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:col-span-2">
                      <FormLabel className="text-sm font-medium">
                        Địa chỉ
                      </FormLabel>
                      <FormControl>
                        <Input className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <Button
                  type="submit"
                  className="h-11 flex-1"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1"
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
  );
};

export default EditProfile;
