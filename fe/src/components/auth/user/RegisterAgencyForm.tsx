"use client";

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
import { toast } from "sonner";
import { useEffect, useState } from "react";
import FileUpload from "@/components/common/Upload/FileUpload";
import { useAgencyService } from "@/services/agencyService";

// Schema xác thực cho form đăng kí đại lý
const formSchema = z.object({
  agency_name: z.string().min(2, "Tên công ty phải có ít nhất 2 ký tự"),
  license_number: z.string().min(5, "Số giấy phép kinh doanh không hợp lệ"),
  hotline: z.string().regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  email_agency: z.string().email("Email không hợp lệ"),
  address_agency: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  license_file: z
    .any()
    .refine(
      (file) =>
        typeof window !== "undefined" &&
        file instanceof FileList &&
        file.length > 0,
      { message: "Vui lòng tải lên giấy phép kinh doanh" }
    ),
  avatar: z
    .any()
    .refine(
      (file) =>
        typeof window !== "undefined" &&
        file instanceof FileList &&
        file.length > 0,
      { message: "Vui lòng tải lên logo đại lý" }
    ),
  agree: z.boolean().refine((val) => val === true, {
    message: "Bạn cần đồng ý với điều khoản",
  }),
});

const RegisterAgencyForm = () => {
  const { register } = useAgencyService();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agency_name: "",
      license_number: "",
      hotline: "",
      email_agency: "",
      address_agency: "",
      agree: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError && typeof firstError.message === "string") {
        toast.error(firstError.message);
      }
    }
  }, [form.formState.errors]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("agency_name", values.agency_name);
      formData.append("license_number", values.license_number);
      formData.append("hotline", values.hotline);
      formData.append("email_agency", values.email_agency);
      formData.append("address_agency", values.address_agency);
      formData.append("license_file", values.license_file[0]);
      formData.append("avatar", values.avatar[0]);

      console.log("Dữ liệu gửi đi:");
      for (let [key, val] of formData.entries()) {
        console.log(`${key}:`, val);
      }

      const res = await register(formData);
      console.log(res);
      if (res.success) {
        if (typeof res.message === "string") {
          toast.success(res.message);
        } else {
          toast.success("Đăng kí đại lý thành công");
        }
        form.reset();
      } else {
        let errorMsg: string | undefined;

        if (typeof res.message === "string") {
          errorMsg = res.message;
        }
        toast.error(errorMsg || "Đăng kí đại lý thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-xl shadow-xl p-6 w-full">
      <h1 className="text-2xl font-bold text-center mb-6">
        Đăng ký trở thành Đại lý Viettravel
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          encType="multipart/form-data"
        >
          <FormField
            control={form.control}
            name="agency_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên công ty</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Công ty TNHH Viettravel Partner"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="license_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số giấy phép kinh doanh</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hotline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotline</FormLabel>
                  <FormControl>
                    <Input placeholder="0987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email_agency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@agency.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_agency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Hà Đông, Hà Nội" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="license_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giấy phép kinh doanh</FormLabel>
                  <FormControl>
                    <FileUpload
                      type="image"
                      value={field.value ? Array.from(field.value) : []}
                      onChange={(files) => {
                        const dataTransfer = new DataTransfer();
                        files.forEach((file) => dataTransfer.items.add(file));
                        field.onChange(dataTransfer.files);
                      }}
                      label=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo đại lý</FormLabel>
                  <FormControl>
                    <FileUpload
                      type="image"
                      value={field.value ? Array.from(field.value) : []}
                      onChange={(files) => {
                        const dataTransfer = new DataTransfer();
                        files.forEach((file) => dataTransfer.items.add(file));
                        field.onChange(dataTransfer.files);
                      }}
                      label=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormControl>
                <FormLabel>
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-blue-500 underline">
                    điều khoản và chính sách
                  </a>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu đăng ký"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterAgencyForm;
