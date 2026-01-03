"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { BookingDetail } from "@/types/booking";
import { usePaymentService } from "@/services/paymentService";
import { formatMoneyVND } from "@/utils/formatPrice";

interface Props {
  booking: BookingDetail;
}
function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={strong ? "text-sm font-semibold" : "text-sm font-medium"}>
        {value}
      </div>
    </div>
  );
}

const CheckoutPaymentActionCard = ({ booking }: Props) => {
  const router = useRouter();
  const { createMomoPayment } = usePaymentService();

  const [submitting, setSubmitting] = useState(false);

  const totalText = useMemo(
    () => formatMoneyVND(booking.total_price),
    [booking]
  );

  const canPay = booking.status === "paid_waiting" && !booking.paid_at;

  const handlePay = async () => {
    if (!canPay) {
      toast.message("Đơn hàng chưa sẵn sàng để thanh toán.");
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      const res = await createMomoPayment({ booking_id: booking.booking_id });

      if (!res?.success) {
        toast.error(
          typeof res?.message === "string"
            ? res.message
            : "Không tạo được thanh toán."
        );
        return;
      }

      const payUrl = res.data?.pay_url;
      if (!payUrl) {
        toast.error("Thiếu pay_url từ MoMo.");
        return;
      }

      window.location.href = payUrl;
    } catch {
      toast.error("Lỗi hệ thống khi tạo thanh toán.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="font-semibold">Xác nhận thanh toán</div>

      <div className="rounded-xl border p-4 space-y-2">
        <Row
          label="Mã đơn"
          value={`#${booking.booking_id.slice(0, 8).toUpperCase()}`}
        />
        <Row
          label="Số lượng"
          value={`${booking.num_adults} NL • ${booking.num_children} TE`}
        />
        <Row label="Tổng tiền" value={totalText} strong />
      </div>

      {!canPay ? (
        <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-600">
          Đơn hàng chưa ở trạng thái cho phép thanh toán.
        </div>
      ) : null}

      <Button
        className="w-full rounded-xl"
        onClick={handlePay}
        disabled={!canPay || submitting}
      >
        {submitting ? "Đang chuyển sang MoMo..." : "Thanh toán ngay (MoMo)"}
      </Button>

      <Button
        variant="outline"
        className="w-full rounded-xl"
        onClick={() =>
          router.replace(`/dashboard/orders/${booking.booking_id}`)
        }
      >
        Quay lại chi tiết đơn
      </Button>
    </Card>
  );
};
export default CheckoutPaymentActionCard;
