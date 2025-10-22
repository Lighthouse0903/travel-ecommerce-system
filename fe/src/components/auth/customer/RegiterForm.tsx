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
import { FaFacebook, FaGoogle } from "react-icons/fa";

const formSchema = z
  .object({
    firstName: z.string().min(2, "Họ phải có ít nhất 2 ký tự").max(30),
    lastName: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(30),
    userName: z
      .string()
      .min(2, "Tên người dùng phải có ít nhất 2 ký tự")
      .max(30),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự")
      .max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
                Đăng kí
              </h1>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-1"
                >
                  <div className="grid grid-cols-2 gap-x-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ</FormLabel>
                          <FormControl>
                            <Input placeholder="Nguyễn Văn" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên</FormLabel>
                          <FormControl>
                            <Input placeholder="An" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên người dùng</FormLabel>
                        <FormControl>
                          <Input placeholder="Anhnv213" {...field} />
                        </FormControl>
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
                          <Input
                            placeholder="viettravel@gmail.com"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email hoặc số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0987654321" {...field} />
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
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận khẩu</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full  mt-0">
                    Tạo tài khoản
                  </Button>
                </form>
              </Form>
              <p className="text-sm text-gray-900 text-center mt-2 hidden sm:inline">
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

export default RegisterForm;
