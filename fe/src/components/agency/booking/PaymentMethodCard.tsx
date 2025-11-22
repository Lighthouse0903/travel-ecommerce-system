import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import { BookingStatus } from "@/types/booking";

interface PaymentMethodCardProps {
  booking_date: string;
  status: BookingStatus;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  booking_date,
  status,
}) => {
  // Đơn đã thanh toán nếu status = paid_waiting hoặc confirmed
  const isPaid = status === "paid_waiting" || status === "confirmed";

  return (
    <div>
      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Thông tin thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-slate-600">
          <p>
            Trạng thái thanh toán:{" "}
            <span className="font-semibold text-slate-900">
              {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </span>
          </p>
          <p>
            Ngày đặt:{" "}
            <span className="font-semibold text-slate-900">
              {formatDate(booking_date)}
            </span>
          </p>
          {/* Sau này có thể bổ sung phương thức thanh toán, mã giao dịch, v.v. */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodCard;
