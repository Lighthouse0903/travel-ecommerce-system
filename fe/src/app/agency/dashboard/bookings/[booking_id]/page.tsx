"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import OrderSummaryCard from "@/components/common/booking/OrderSummaryCard";
import { useBookingService } from "@/services/bookingService";
import { BookingDetail, BookingStatus } from "@/types/booking";
import CustomerInforCard from "@/components/agency/booking/CustomerInforCard";
import PaymentMethodCard from "@/components/agency/booking/PaymentMethodCard";
import { formatDate } from "@/utils/formatDate";
import ActivesCard from "@/components/agency/booking/ActivesCard";

const STATUS_CONFIG: Record<
  BookingStatus | string,
  { label: string; className: string }
> = {
  pending: {
    label: "Chưa thanh toán",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  paid_waiting: {
    label: "Đã thanh toán - Chờ xác nhận",
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

// luôn trả về 1 style hợp lệ, kể cả khi status lạ
const getStatusStyle = (status?: BookingStatus | string) => {
  if (!status) {
    return {
      label: "Unknown",
      className: "bg-slate-100 text-slate-700 border-slate-200",
    };
  }

  return (
    STATUS_CONFIG[status] ?? {
      label: String(status),
      className: "bg-slate-100 text-slate-700 border-slate-200",
    }
  );
};

const AgencyBookingDetailPage: React.FC = () => {
  const { booking_id } = useParams();
  const { getDetailBookingAgency, updateStatusBooking } = useBookingService();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState<string[]>([
    "Khách yêu cầu suất ăn chay. Đã xác nhận với đơn vị tổ chức tour.",
  ]);

  const [actionLoading, setActionLoading] = useState<
    "confirmed" | "cancelled" | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDetailBookingAgency(booking_id as string);
        console.log("API response: ", res);
        setBooking(res?.data as BookingDetail);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (booking_id) {
      fetchData();
    }
  }, [booking_id]);

  const handleAddNote = () => {
    if (!notes.trim()) return;
    setInternalNotes((prev) => [notes.trim(), ...prev]);
    setNotes("");
  };

  if (loading) {
    return <div className="p-6">Đang tải chi tiết booking...</div>;
  }

  if (!booking) {
    return <div className="p-6">Không tìm thấy booking.</div>;
  }

  const statusStyle = getStatusStyle(booking.status);

  // Hàm xác nhận đơn hàng
  const handleConfirmed = async () => {
    if (!booking) return;

    try {
      setActionLoading("confirmed");
      await updateStatusBooking(booking.booking_id, "confirmed");

      setBooking((prev) =>
        prev ? { ...prev, status: "confirmed" as BookingStatus } : prev
      );
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  // Hàm hủy đơn hàng
  const handleCancelled = async () => {
    if (!booking) return;

    try {
      setActionLoading("cancelled");
      await updateStatusBooking(booking.booking_id, "cancelled");

      setBooking((prev) =>
        prev ? { ...prev, status: "cancelled" as BookingStatus } : prev
      );
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };
  const isFinalStatus =
    booking.status === "confirmed" || booking.status === "cancelled";

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/agency/dashboard">
                Bảng điều khiển
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/agency/dashboard/bookings">
                Đơn đặt tour
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Booking #{booking.booking_id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">
            Chi tiết đơn đặt tour #{booking.booking_id}
          </h1>
          <Badge
            variant="outline"
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle.className}`}
          >
            {statusStyle.label}
          </Badge>
        </div>

        <p className="text-sm text-slate-500">
          Ngày tạo: {formatDate(booking.booking_date)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          {/* Thông tin khách hàng */}
          <CustomerInforCard
            customer_name={booking.customer_name}
            customer_address={booking.customer_address}
            customer_email={booking.customer_email}
            customer_phone={booking.customer_phone}
          />

          {/* Tóm tắt đơn hàng */}
          <OrderSummaryCard booking={booking} />

          {/* Phương thức thanh toán*/}
          <PaymentMethodCard
            booking_date={booking.booking_date}
            status={booking.status as BookingStatus}
          />
        </div>

        {/* Hành động */}
        <div className="space-y-6">
          <ActivesCard
            onCanceled={handleCancelled}
            onConfirmed={handleConfirmed}
            confirmLoading={actionLoading === "confirmed"}
            cancelLoading={actionLoading === "cancelled"}
            disabled={isFinalStatus}
          />
          {/* ghi chú */}
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Ghi chú nội bộ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-36 overflow-y-auto text-xs text-slate-700">
                {internalNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border bg-slate-50 px-3 py-2"
                  >
                    {note}
                  </div>
                ))}
                {internalNotes.length === 0 && (
                  <p className="text-xs text-slate-400">
                    Chưa có ghi chú nào cho booking này.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Thêm ghi chú mới..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <Button
                  className="w-full justify-center"
                  onClick={handleAddNote}
                >
                  Thêm ghi chú
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyBookingDetailPage;
