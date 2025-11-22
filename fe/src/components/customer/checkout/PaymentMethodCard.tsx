"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethod = "momo" | "zalo" | "later";

interface PaymentMethodsProps {
  value?: PaymentMethod;
  onChange?: (method: PaymentMethod) => void;
}

const PaymentMethodsCard: React.FC<PaymentMethodsProps> = ({
  value,
  onChange,
}) => {
  const [selected, setSelected] = useState<PaymentMethod>(value ?? "momo");

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  const handleSelect = (method: PaymentMethod) => {
    setSelected(method);
    onChange?.(method);
  };

  const renderMethodButton = (
    method: PaymentMethod,
    title: string,
    description: string
  ) => {
    const active = selected === method;
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => handleSelect(method)}
        className={cn(
          "w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left h-auto",
          active
            ? "border-blue-500 bg-blue-50"
            : "border-slate-200 bg-white hover:bg-slate-50"
        )}
      >
        {/* text */}
        <div className="flex flex-col items-start gap-0.5">
          <span className="font-medium text-slate-900">{title}</span>
          <span className="text-xs text-slate-500">{description}</span>
        </div>

        {/* icon tròn */}
        <Circle
          className={cn(
            "w-5 h-5 stroke-2",
            active ? "text-blue-500 fill-blue-500/20" : "text-slate-300"
          )}
        />
      </Button>
    );
  };

  return (
    <section className="bg-slate-50 rounded-xl shadow-md border p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Phương thức thanh toán
      </h2>

      <div className="space-y-2">
        {renderMethodButton(
          "momo",
          "Thanh toán qua MoMo",
          "Hệ thống sẽ chuyển bạn đến cổng thanh toán MoMo để hoàn tất giao dịch."
        )}

        {renderMethodButton(
          "zalo",
          "Thanh toán qua ZaloPay",
          "Bạn sẽ được chuyển hướng đến cổng thanh toán ZaloPay để hoàn tất giao dịch."
        )}

        {renderMethodButton(
          "later",
          "Thanh toán sau",
          "Giữ chỗ và thanh toán sau. Nhân viên tư vấn sẽ liên hệ với bạn."
        )}
      </div>
    </section>
  );
};

export default PaymentMethodsCard;
