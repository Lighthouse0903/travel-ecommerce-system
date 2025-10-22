"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10).max(11),
  message: z.string().min(1, "Tin nhắn không được để trống").max(200),
});

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <>
      {/* Section 1: Header */}
      <section className="relative w-full overflow-hidden">
        <Image
          src="https://i.pinimg.com/1200x/c0/a9/0d/c0a90dbe753e3c327fae122fbaa8a0a2.jpg"
          alt="Khám phá Việt Nam"
          width={1500}
          height={1000}
          className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-around w-[90vw] md:w-[80vw] h-auto px-4">
            <h1 className="text-xl sm:text-2xl md:text-[40px] font-bold text-center text-white mb-4">
              Liên hệ với VietTravel
            </h1>
            <p className="text-center text-[10px] sm:text-[15px] md:text-[20px] font-thin text-slate-100 mb-4">
              Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến, thắc mắc và hỗ trợ
              bạn trong quá trình lên kế hoạch cho chuyến đi tuyệt vời của mình.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="w-full flex justify-center items-center py-10">
        <div className="w-[90%] md:w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-y-7 gap-x-9">
          {/* Thông tin liên hệ */}
          <div className="bg-slate-100 flex flex-col justify-center items-start p-4 sm:p-7 border-spacing-0 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-7">
              Thông tin liên hệ
            </h2>
            <div className="flex flex-col items-start justify-center">
              <p className="text-gray-600 leading-relaxed mb-3">
                <strong>Địa chỉ: </strong>96A Đ. Trần Phú, P. Mộ Lao, Hà Đông,
                Hà Nội
              </p>
              <p className="text-gray-600 leading-relaxed mb-3">
                <strong>Điện thoại: </strong>(+84) 024 3756 2186
              </p>
              <p className="text-gray-600 leading-relaxed mb-3">
                <strong>Email: </strong>support@viettravel.com
              </p>
              <p className="text-gray-600 leading-relaxed mb-3">
                <strong>Giờ làm việc: </strong>Thứ 2 - Thứ 7 (8:00 - 17:30)
              </p>
            </div>
          </div>

          {/* Gửi tin nhắn */}
          <div className="bg-slate-100 flex flex-col justify-center items-start p-4 sm:p-7 border-spacing-0 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-7">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ tên của bạn"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Địa chỉ email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="viettravel@gmail.com"
                          className="w-full"
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
                    <FormItem className="w-full">
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="(+84)"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nội dung tin nhắn</FormLabel>
                      <FormControl className="h-20">
                        <Textarea
                          placeholder="Bạn muốn gửi điều gì tới chúng tôi?"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Gửi tin nhắn
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
};
export default Contact;
