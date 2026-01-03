"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useAuthActions, RegisterFormValues } from "@/hooks/useAuthActions";
import PasswordInput from "@/components/common/PasswordInput";

const formSchema = z
  .object({
    full_name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự").max(50),
    username: z
      .string()
      .min(2, "Tên người dùng phải có ít nhất 2 ký tự")
      .max(30),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa (A-Z)")
      .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ thường (a-z)")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 số")
      .regex(/[^a-zA-Z0-9]/, "Phải chứa ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z
      .string()
      .min(8, "Xác nhận mật khẩu phải có ít nhất 8 ký tự")
      .max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

const RegisterForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { registerAction } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await registerAction(values, form, onSuccess);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
      {/* Cột trái */}
      <div className="hidden lg:flex justify-center items-center">
        <div className="flex flex-col gap-y-4 w-[90%] max-w-[600px]">
          <Image
            src="https://i.pinimg.com/736x/be/70/0e/be700edfa46510a011d91b9998fe5617.jpg"
            alt="Ảnh"
            width={700}
            height={500}
            className="w-full rounded-xl object-cover"
          />
          <div className="flex flex-col p-4 rounded-xl bg-slate-100">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Quyền lợi thành viên
            </h1>
            <p className="text-gray-700">• Tour chọn lọc chất lượng nhất</p>
            <p className="text-gray-700">
              • Đội ngũ tư vấn chi tiết và tận tình
            </p>
            <p className="text-gray-700">
              • Nhận nhiều chương trình ưu đãi hấp dẫn từ chúng tôi
            </p>
          </div>
        </div>
      </div>

      {/* Cột phải */}
      <div className="bg-slate-100 flex justify-center items-center p-6 rounded-xl">
        <div className="w-full max-w-[500px]">
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-center mb-[20px]">Đăng ký</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-1"
              >
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên người dùng</FormLabel>
                      <FormControl>
                        <Input placeholder="anhnv213" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="viettravel@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-0"
                  disabled={!form.formState.isValid || isSubmitting}
                >
                  {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </Button>
              </form>
            </Form>

            <p className="text-sm text-gray-900 text-center mt-2 hidden sm:inline">
              Viettravel cam kết bảo mật và sẽ không bao giờ đăng hay chia sẻ
              thông tin mà chưa có sự đồng ý của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
