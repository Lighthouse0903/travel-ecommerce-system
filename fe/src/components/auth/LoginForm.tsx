"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import { useAuthActions } from "@/hooks/useAuthActions";
import PasswordInput from "@/components/common/PasswordInput";
import { LoginFormValues, loginSchema } from "@/schemas/auth";

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginAction } = useAuthActions();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await loginAction(values, form, onSuccess);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Cột trái - chỉ hiện khi màn hình lg trở lên */}
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

        {/* Cột phải - luôn hiển thị, chiếm toàn bộ khi nhỏ hơn lg */}
        <div className="bg-slate-100 flex justify-center items-center p-6 rounded-xl">
          <div className="w-full max-w-[500px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-center mb-[20px]">
                Đăng Nhập
              </h1>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="usernameOrEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập hoặc Email</FormLabel>
                        <FormControl>
                          <Input
                            className="h-8 sm:h-10 text-sm sm:text-base"
                            placeholder="Tên đăng nhập hoặc viettravel@gmail.com"
                            {...field}
                          />
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
                          <PasswordInput
                            className="h-8 sm:h-10 text-sm sm:text-base"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <Link href={"#"}>
                    <p className="text-blue-500 text-sm mt-3 mb-0 sm:text-base">
                      Quên mật khẩu?
                    </p>
                  </Link> */}
                  <Button
                    type="submit"
                    className="w-full mt-0 text-sm sm:text-base"
                    disabled={!form.formState.isValid || isSubmitting}
                  >
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>
              </Form>
              <p className=" hidden sm:inline text-sm text-gray-900 text-center mt-2 sm:text-base">
                Viettravel cam kết bảo mật và sẽ không bao giờ đăng hay chia sẻ
                thông tin mà chưa có được sự đồng ý của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginForm;
