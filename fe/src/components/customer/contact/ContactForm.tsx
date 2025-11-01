"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10).max(11),
  message: z.string().min(1, "Tin nhắn không được để trống").max(200),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="bg-slate-100 flex flex-col justify-center items-start p-4 sm:p-7 rounded-xl shadow-xl">
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
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ tên của bạn" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ email</FormLabel>
                <FormControl>
                  <Input placeholder="viettravel@gmail.com" {...field} />
                </FormControl>
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
                  <Input placeholder="(+84)" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung tin nhắn</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Bạn muốn gửi điều gì tới chúng tôi?"
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
  );
}
