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
import { AgencyResponse } from "@/types/agency";
import { useRouter } from "next/navigation";

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
  const { registerAgency, getInforAgency } = useAgencyService();
  const [existingAgency, setExistingAgency] = useState<AgencyResponse | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

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

  // Hiện toast lỗi validation đầu tiên
  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError && typeof firstError.message === "string") {
        toast.error(firstError.message);
      }
    }
  }, [form.formState.errors]);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const res = await getInforAgency();

        if (res.success && res.data) {
          const agency = res.data;
          setExistingAgency(agency);

          if (agency.status === "approved") {
            // Đã được duyệt -> không cho vào trang đăng ký nữa
            router.push("/agency/dashboard/profile");
            return;
          }

          if (agency.status === "pending") {
            // Đã gửi yêu cầu -> đóng băng form + prefill
            form.reset({
              agency_name: agency.agency_name,
              license_number: agency.license_number,
              hotline: agency.hotline,
              email_agency: agency.email_agency,
              address_agency: agency.address_agency,
              agree: true,
            });
            setIsSubmitted(true); // đóng băng form
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchAgency();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Chặn double submit + chặn submit lại sau khi đã gửi thành công
    if (isSubmitting || isSubmitted) return;
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

      const res = await registerAgency(formData);
      console.log("Api registerAgency response", res);

      if (res.success) {
        setIsSubmitted(true); // đóng băng form

        let msg =
          typeof res.message === "string"
            ? res.message
            : "Gửi yêu cầu đăng ký đại lý thành công! Vui lòng chờ admin phê duyệt.";

        toast.success(msg);

        return;
      } else {
        // xử lý lỗi
        const raw = res.error.message;
        let msg = "Lỗi không xác định";
        if (raw && typeof raw === "object") {
          const firstValue = Object.values(raw)[0];
          msg = Array.isArray(firstValue) ? firstValue[0] : firstValue;
        }
        console.log("Lỗi :", msg);
        toast.error(msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isSubmitting || isSubmitted;

  return (
    <div className="bg-slate-50 rounded-xl shadow-xl p-6 w-full">
      <h1 className="text-2xl font-bold text-center mb-2">
        Đăng ký trở thành Đại lý Viettravel
      </h1>
      <p className="text-center text-sm text-slate-600 mb-6">
        Vui lòng điền đầy đủ thông tin. Sau khi gửi, yêu cầu của bạn sẽ được
        admin kiểm duyệt trong thời gian sớm nhất.
      </p>

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
                    disabled={disabled}
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
                    <Input
                      placeholder="0123456789"
                      disabled={disabled}
                      {...field}
                    />
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
                    <Input
                      placeholder="0987654321"
                      disabled={disabled}
                      {...field}
                    />
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
                    <Input
                      placeholder="example@agency.com"
                      disabled={disabled}
                      {...field}
                    />
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
                    <Input
                      placeholder="Hà Đông, Hà Nội"
                      disabled={disabled}
                      {...field}
                    />
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
                        if (disabled) return; // không cho đổi file khi đã gửi
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
                        if (disabled) return;
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
                    disabled={disabled}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormControl>
                <FormLabel className="text-sm">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-blue-500 underline">
                    điều khoản và chính sách
                  </a>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={disabled}>
            {isSubmitted
              ? "Đã gửi yêu cầu đăng ký"
              : isSubmitting
              ? "Đang gửi..."
              : "Gửi yêu cầu đăng ký"}
          </Button>

          {isSubmitted && (
            <p className="text-center text-sm text-green-700 mt-2">
              Yêu cầu đăng ký đại lý của bạn đã được gửi. Vui lòng chờ admin phê
              duyệt, chúng tôi sẽ liên hệ qua email hoặc hotline bạn đã cung
              cấp.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default RegisterAgencyForm;
