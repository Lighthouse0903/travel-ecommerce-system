"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBookingService } from "@/services/bookingService";
import { BookingDetail, BookingCustomer, BookingStatus } from "@/types/booking";

import CustomerInforCard from "@/components/customer/checkout/CustomerInforCard";
import OrderSummaryCard from "@/components/common/booking/OrderSummaryCard";
import PaymentMethodsCard from "@/components/customer/checkout/PaymentMethodCard";
import { Button } from "@/components/ui/button";
import { usePaymentService } from "@/services/paymentService";
import { useAuthService } from "@/services/authService";
import { toast } from "sonner";
import { motion } from "framer-motion";

type PaymentMethod = "momo" | "zalo" | "later";

const CheckOut = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [customerInfo, setCustomerInfo] = useState<BookingCustomer | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("momo");
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getDetailBookingCustomer } = useBookingService();
  const { createMomoPayment } = usePaymentService();
  const { update } = useAuthService();

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  // lấy chi tiết booking + map ra customerInfo từ booking
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDetailBookingCustomer(bookingId as string);
        const data = (res?.data ?? null) as BookingDetail | null;
        setBooking(data);

        if (data) {
          const mappedCustomer: BookingCustomer = {
            full_name: data.customer_name ?? "",
            email: data.customer_email ?? "",
            phone: data.customer_phone ?? "",
            address: data.customer_address ?? "",
          };

          setCustomerInfo(mappedCustomer);

          //  kiểm tra xem đã đủ thông tin chưa
          const isValid =
            !!mappedCustomer.full_name.trim() &&
            !!mappedCustomer.phone.trim() &&
            !!mappedCustomer.email.trim();

          setIsCustomerValid(isValid);
        }
      } catch (e) {
        console.log("Lỗi khi lấy chi tiết đơn hàng:", e);
        toast.error("Không tải được thông tin đơn hàng.");
      }
    };

    if (bookingId) fetchData();
  }, [bookingId]);

  if (!booking || !customerInfo) {
    return (
      <div className="w-full flex justify-center p-5">
        <motion.div
          {...fadeUp}
          className="w-[95%] sm:w-[90%] flex items-center justify-center h-[50vh]"
        >
          Đang tải dữ liệu...
        </motion.div>
      </div>
    );
  }

  // ====== SUY RA TRẠNG THÁI TỪ booking.status ======
  const status = booking.status as BookingStatus | undefined;

  const isPending = status === "pending";
  const isPaidWaiting = status === "paid_waiting";
  const isConfirmed = status === "confirmed";
  const isCancelled = status === "cancelled";

  // Đơn đã có thanh toán (MoMo ok) = paid_waiting hoặc confirmed
  const alreadyPaid = isPaidWaiting || isConfirmed;

  // Chỉ cho bấm nút thanh toán khi còn pending
  const canConfirmPayment = isPending;

  // disabled cho nút "Xác nhận thanh toán"
  const disableConfirmButton =
    !isCustomerValid || isSubmitting || !canConfirmPayment;

  //  nhận giá trị từ CustomerInforCard
  const handleCustomerChange = (value: BookingCustomer) => {
    setCustomerInfo(value);

    const isValid =
      !!value.full_name?.trim() &&
      !!value.phone?.trim() &&
      !!value.email?.trim();

    setIsCustomerValid(isValid);
  };

  // click "Xác nhận thanh toán"
  const handleConfirm = async () => {
    // nếu status không còn cho phép thanh toán nữa thì chặn luôn
    if (!canConfirmPayment) {
      if (alreadyPaid) {
        toast.info(
          "Đơn đặt tour này đã được thanh toán. Bạn không thể thanh toán lại."
        );
      } else if (isCancelled) {
        toast.info(
          "Đơn đặt tour này đã bị hủy. Vui lòng tạo đơn mới nếu muốn đặt lại tour."
        );
      } else {
        toast.info("Đơn đặt tour này không còn hợp lệ để thanh toán.");
      }
      return;
    }

    try {
      if (!isCustomerValid || !customerInfo) {
        toast.error(
          "Vui lòng điền đầy đủ và chính xác thông tin người đặt tour trước khi thanh toán."
        );
        return;
      }

      setIsSubmitting(true);

      // cập nhật thông tin user
      const updateRes = await update({
        full_name: customerInfo.full_name,
        phone: customerInfo.phone,
        email: customerInfo.email,
      });

      if (!updateRes.success) {
        toast.error(
          typeof updateRes.message === "string"
            ? updateRes.message
            : "Cập nhật thông tin tài khoản thất bại."
        );
        return;
      }

      //  update user OK -> gọi thanh toán
      if (paymentMethod === "momo") {
        const res = await createMomoPayment({
          booking_id: booking.booking_id,
        });

        if (res?.data?.pay_url) {
          window.location.href = res.data.pay_url;
        } else {
          toast.error("Không lấy được link thanh toán MoMo.");
        }
      } else if (paymentMethod === "zalo") {
        toast.info("Tích hợp ZaloPay sẽ làm sau.");
      } else if (paymentMethod === "later") {
        toast.success(
          "Đã ghi nhận yêu cầu giữ chỗ. Nhân viên sẽ liên hệ với bạn."
        );
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center p-5">
      <motion.div {...fadeUp} className="w-[95%] sm:w-[90%]">
        <h1 className="text-xl sm:text-3xl font-semibold mb-4">
          Xác nhận đặt tour &amp; Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
          <div className="space-y-4">
            {/* Tóm tắt đơn hàng */}
            <OrderSummaryCard booking={booking} />

            {/* Chọn phương thức thanh toán (chỉ có ý nghĩa khi còn pending) */}
            <PaymentMethodsCard
              value={paymentMethod}
              onChange={(m) => setPaymentMethod(m)}
            />

            <div className="bg-white rounded-2xl shadow-sm border p-5 space-y-3">
              {/* Thông tin trạng thái thanh toán theo status */}
              {alreadyPaid && (
                <p className="text-xs text-emerald-600">
                  Đơn đặt tour này đã được thanh toán. Bạn không thể thanh toán
                  lại.
                </p>
              )}

              {isCancelled && (
                <p className="text-xs text-rose-600">
                  Đơn đặt tour này đã bị hủy. Vui lòng tạo đơn mới nếu bạn muốn
                  đặt lại tour.
                </p>
              )}

              {isPending && (
                <p className="text-xs text-slate-500">
                  Đơn đặt tour của bạn chưa được thanh toán. Vui lòng kiểm tra
                  thông tin và tiến hành thanh toán để hoàn tất đặt tour.
                </p>
              )}

              <p className="text-xs text-slate-500">
                Bằng việc nhấn{" "}
                <span className="font-semibold">"Xác nhận thanh toán"</span>,
                bạn đã đọc và đồng ý với{" "}
                <a
                  href="/terms"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Điều khoản &amp; Điều kiện
                </a>{" "}
                và{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Chính sách quyền riêng tư
                </a>{" "}
                của chúng tôi.
              </p>

              <Button
                type="button"
                onClick={handleConfirm}
                disabled={disableConfirmButton}
                className="w-full h-11 text-sm sm:text-base font-semibold disabled:opacity-60"
              >
                {isSubmitting
                  ? "Đang xử lý..."
                  : alreadyPaid || isCancelled
                  ? "Không thể thanh toán"
                  : "Xác nhận thanh toán"}
              </Button>

              {!isCustomerValid && isPending && (
                <p className="text-xs text-red-500 mt-1">
                  Vui lòng hoàn thiện đầy đủ thông tin người đặt tour trước khi
                  thanh toán.
                </p>
              )}
            </div>
          </div>

          {/* thông tin người đặt tour */}
          <CustomerInforCard
            value={customerInfo}
            onChange={handleCustomerChange}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CheckOut;
