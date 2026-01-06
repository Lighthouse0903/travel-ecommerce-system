"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

import type {
  ChangePassword as ChangePasswordPayload,
  MessageResponse,
} from "@/types/auth";

import PasswordInput from "@/components/common/PasswordInput";
import { ChangePasswordFormValues, changePasswordSchema } from "@/schemas/auth";
const inputClass =
  "bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

const ChangePassword = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { change_password } = useAuthService();
  const [loading, setLoading] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const errors = form.formState.errors;
    if (!errors || Object.keys(errors).length === 0) return;

    const firstError = Object.values(errors)[0];
    if (firstError?.message) toast.error(String(firstError.message));
  }, [form.formState.errors]);

  const onSubmit = async (values: ChangePasswordFormValues) => {
    if (loading) return;

    setLoading(true);
    toast.dismiss();

    const payload: ChangePasswordPayload = {
      current_password: values.current_password,
      new_password: values.new_password,
    };

    try {
      const res = await change_password(payload);

      if (res.success) {
        const msg =
          (res.data as MessageResponse)?.message ||
          (typeof res.message === "string" ? res.message : "") ||
          "Đổi mật khẩu thành công";

        toast.success(msg);
        router.push("/dashboard/profile");
        form.reset();
        return;
      }

      const firstMsg = res.error?.errors
        ? Object.values(res.error.errors).flat()[0]
        : res.message;

      toast.error(
        typeof firstMsg === "string" && firstMsg.trim()
          ? firstMsg
          : "Đổi mật khẩu thất bại"
      );
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-background p-4 md:p-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
    <div className="bg-card p-4 md:p-6 border border-bord rounded-xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Đổi mật khẩu
        </h1>
        <p className="text-sm text-muted-foreground">
          Cập nhật mật khẩu mới để bảo mật tài khoản của bạn
        </p>
      </div>

      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardContent className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Mật khẩu hiện tại
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className={inputClass}
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
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Mật khẩu mới
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className={inputClass}
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
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Xác nhận mật khẩu mới
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className={inputClass}
                        autoComplete="new-password"
                        placeholder="Nhập lại mật khẩu mới"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <Button
                  type="submit"
                  className="h-11 flex-1"
                  disabled={!form.formState.isValid || loading}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1"
                  onClick={() => form.reset()}
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

export default ChangePassword;
