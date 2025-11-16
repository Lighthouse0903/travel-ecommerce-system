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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { useAuthService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { UserResponse } from "@/types/user";

const formSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "Vui lòng nhập email hoặc tên đăng nhập")
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^[a-zA-Z0-9_]+$/.test(value),
      "Vui lòng nhập tên đăng nhập hoặc email hợp lệ"
    ),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100),
});

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { setAccess, setUser } = useAuth();
  const { login } = useAuthService();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        login: values.usernameOrEmail,
        password: values.password,
      };

      const res = await login(payload);

      if (res.success && res.data) {
        onSuccess?.();
        const currentUser: UserResponse = res.data.user;
        setAccess(res.data.access);
        setUser(currentUser);
        console.log("Đăng nhập thành công!");
        toast.dismiss();
        toast.success("Đăng nhập thành công!");
        return;
      }

      if (res.error && typeof res.error === "object") {
        const firstKey = Object.keys(res.error)[0];
        let firstMsg = res.error[firstKey]?.[0];
        console.log("Chi tiết lỗi đăng nhập:", res.error);
        if (res.error.detail === "Invalid credentials.") {
          firstMsg = "Thông tin đăng nhập không chính xác";
        }
        toast.dismiss();
        toast.error(firstMsg);
      } else {
        toast.dismiss();
        toast.error(
          typeof res.message === "string"
            ? res.message
            : JSON.stringify(res.message) || "Đăng nhập thất bại!"
        );
      }
    } catch (error: any) {
      if (error?.error) {
        console.log("Chi tiết lỗi từ server:", error.error);

        if (error.error.username_or_email) {
          console.log("Lỗi username/email:", error.error.username_or_email[0]);
        }
        if (error.error.password) {
          console.log("Lỗi password:", error.error.password[0]);
        }
      }
      toast.dismiss();
      toast.error(error?.message || "Lỗi kết nối máy chủ!");
      console.log("Lỗi kết nối tới máy chủ");
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
                          <Input
                            className="h-8 sm:h-10 text-sm sm:text-base"
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Link href={"#"}>
                    <p className="text-blue-500 text-sm mt-3 mb-0 sm:text-base">
                      Quên mật khẩu?
                    </p>
                  </Link>
                  <Button
                    type="submit"
                    className="w-full mt-0 text-sm sm:text-base"
                  >
                    Đăng nhập
                  </Button>
                </form>
              </Form>
              <p className=" hidden sm:inline text-sm text-gray-900 text-center mt-2 sm:text-base">
                Viettravel cam kết bảo mật và sẽ không bao giờ đăng hay chia sẻ
                thông tin mà chưa có được sự đồng ý của bạn.
              </p>
              <hr className="h-1 mt-2" />
              <p className="text-center text-[13px]">hoặc đăng nhập qua</p>
              <div className="w-full grid grid-cols-2 mt-5">
                <div className="flex justify-center items-center">
                  <FaFacebook size={30} />
                  aceBook
                </div>
                <div className="flex justify-center items-center">
                  <FaGoogle size={30} />
                  oogle
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginForm;
