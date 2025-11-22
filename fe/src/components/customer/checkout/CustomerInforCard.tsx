"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BookingCustomer } from "@/types/booking";
import { z } from "zod";

const customerSchema = z.object({
  full_name: z.string().min(1, "Vui lòng nhập họ và tên."),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại."),
  email: z.string().min(1, "Vui lòng nhập email.").email("Email không hợp lệ."),
  address: z.string().optional(),
});

type CustomerForm = z.infer<typeof customerSchema>;

interface CustomerInforProps {
  value?: BookingCustomer | null;
  onChange?: (value: BookingCustomer) => void;
}

const CustomerInforCard: React.FC<CustomerInforProps> = ({
  value,
  onChange,
}) => {
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CustomerForm, string>>
  >({});

  const current: CustomerForm = {
    full_name: value?.full_name ?? "",
    phone: value?.phone ?? "",
    email: value?.email ?? "",
    address: value?.address ?? "",
  };

  const validate = (v: CustomerForm) => {
    const parsed = customerSchema.safeParse(v);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CustomerForm, string>> = {};

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CustomerForm;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  };

  const handleChange =
    (field: keyof CustomerForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target;
      const next: CustomerForm = {
        ...current,
        [field]: inputValue,
      };

      validate(next);
      onChange?.(next as BookingCustomer);
    };

  return (
    <section className="bg-slate-50 rounded-xl shadow-md border p-5 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Thông tin người đặt tour
      </h2>

      <div className="space-y-3 text-sm text-gray-700">
        {/* Họ tên */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="customer-fullname">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="customer-fullname"
            placeholder="VD: Nguyễn Văn A"
            value={current.full_name}
            onChange={handleChange("full_name")}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500 mt-0.5">{errors.full_name}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="customer-phone">
            Số điện thoại <span className="text-red-500">*</span>
          </Label>
          <Input
            id="customer-phone"
            placeholder="VD: 0901234567"
            value={current.phone}
            onChange={handleChange("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="customer-email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="customer-email"
            type="email"
            placeholder="VD: ban@example.com"
            value={current.email}
            onChange={handleChange("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerInforCard;
