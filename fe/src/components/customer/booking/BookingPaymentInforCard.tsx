"use client";

import React from "react";
import {
  Hash,
  Wallet,
  CalendarClock,
  BadgeCheck,
  XCircle,
  Clock3,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoneyVND } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import { PaymentInfo } from "@/types/payment";

type Props = {
  payment?: PaymentInfo | null;
};

const providerLabel = (p?: string) => {
  if (!p) return "Không xác định";
  if (p === "momo") return "MoMo";
  if (p === "zalopay") return "ZaloPay";
  if (p === "vnpay") return "VNPay";
  return p;
};

const statusLabel = (s?: PaymentInfo["status"]) => {
  if (!s) return "Không xác định";
  if (s === "pending") return "Chờ thanh toán";
  if (s === "processing") return "Đang xử lý";
  if (s === "success") return "Thành công";
  if (s === "failed") return "Thất bại";
  return s;
};

const statusIcon = (s?: PaymentInfo["status"]) => {
  if (s === "success") return <BadgeCheck className="h-4 w-4" />;
  if (s === "failed") return <XCircle className="h-4 w-4" />;
  if (s === "processing") return <Clock3 className="h-4 w-4" />;
  return <Clock3 className="h-4 w-4" />;
};
const BookingPaymentInfoCard = ({ payment }: Props) => {
  if (!payment) {
    return (
      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Thông tin thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Chưa có thông tin thanh toán cho booking này.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Thông tin thanh toán
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <Row
          icon={<Wallet className="h-4 w-4" />}
          label="Phương thức"
          value={providerLabel(payment.provider)}
        />

        <Row
          icon={statusIcon(payment.status)}
          label="Trạng thái"
          value={statusLabel(payment.status)}
        />

        <Row
          icon={<Hash className="h-4 w-4" />}
          label="Mã giao dịch (transId)"
          value={payment.provider_txn || "—"}
          mono
        />

        <Row
          icon={<Hash className="h-4 w-4" />}
          label="Mã đơn thanh toán (orderId)"
          value={payment.transaction_id || "—"}
          mono
        />

        <Row
          icon={<CalendarClock className="h-4 w-4" />}
          label="Thời gian thanh toán"
          value={payment.paid_at ? formatDate(payment.paid_at) : "—"}
        />

        <Row
          icon={<Wallet className="h-4 w-4" />}
          label="Số tiền"
          value={formatMoneyVND(payment.amount)}
        />
      </CardContent>
    </Card>
  );
};

function Row({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 text-muted-foreground min-w-[150px]">
        <span className="mt-0.5">{icon}</span>
        <span>{label}</span>
      </div>

      <div
        className={`text-right font-semibold text-slate-900 break-all ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
export default BookingPaymentInfoCard;
