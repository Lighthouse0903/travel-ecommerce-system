"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RegisterAgencyFormValues } from "@/types/agency";

export const BANKS = [
  {
    value: "Vietcombank",
    label: "Vietcombank",
    icon: "/icon_bank/vcb.png",
  },
  {
    value: "MB Bank",
    label: "MB Bank",
    icon: "/icon_bank/mb.png",
  },
  {
    value: "Techcombank",
    label: "Techcombank",
    icon: "/icon_bank/techcombank.png",
  },
  {
    value: "BIDV",
    label: "BIDV",
    icon: "/icon_bank/bidv.svg",
  },
  {
    value: "ACB",
    label: "ACB",
    icon: "/icon_bank/acb.png",
  },
  {
    value: "Agribank",
    label: "Agribank",
    icon: "/icon_bank/agribank.png",
  },
];

const StepBank = () => {
  const { control } = useFormContext<RegisterAgencyFormValues>();

  return (
    <div className="space-y-5">
      <FormField
        control={control}
        name="bank_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Tên ngân hàng <span className="text-red-500">*</span>
            </FormLabel>

            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngân hàng" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {BANKS.map((bank) => (
                  <SelectItem key={bank.value} value={bank.value}>
                    <div className="flex items-center gap-2">
                      <img
                        src={bank.icon}
                        alt={bank.label}
                        className="h-5 w-5 rounded"
                      />
                      <span>{bank.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="bank_account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Số tài khoản <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="VD: 013910988292xxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bank_account_holder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên chủ tài khoản <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="VD: Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        Tip: Tên chủ tài khoản nên trùng với tên trên tài khoản ngân hàng để
        tránh lỗi đối soát.
      </div>
    </div>
  );
};

export default StepBank;
