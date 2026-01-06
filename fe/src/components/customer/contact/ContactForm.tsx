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
    <div className="bg-card border border-border flex flex-col justify-center items-start p-5 sm:p-7 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Gửi tin nhắn cho chúng tôi
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-foreground/90">
                  Họ và tên
                </FormLabel>
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
                <FormLabel className="text-sm text-foreground/90">
                  Địa chỉ email
                </FormLabel>
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
                <FormLabel className="text-sm text-foreground/90">
                  Số điện thoại
                </FormLabel>
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
                <FormLabel className="text-sm text-foreground/90">
                  Nội dung tin nhắn
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Bạn muốn gửi điều gì tới chúng tôi?"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Gửi tin nhắn
          </Button>

          <p className="text-xs text-muted-foreground">
            VietTravel sẽ phản hồi trong thời gian sớm nhất trong giờ làm việc.
          </p>
        </form>
      </Form>
    </div>
  );
}
