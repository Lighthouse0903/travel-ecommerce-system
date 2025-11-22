"use client";

import React, { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { BookingListPage } from "@/types/booking";
import { useBookingService } from "@/services/bookingService";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatDate";

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Chờ thanh toán",
    className: "bg-amber-100 text-amber-800 border border-amber-300",
  },
  paid_waiting: {
    label: "Đã thanh toán - Chờ xác nhận",
    className: "bg-sky-100 text-sky-800 border border-sky-300",
  },
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-rose-100 text-rose-800 border border-rose-300",
  },
};

const getStatusConfig = (status: string | undefined) => {
  if (!status) {
    return {
      label: "Không xác định",
      className: "bg-slate-100 text-slate-700 border border-slate-300",
    };
  }

  return (
    STATUS_CONFIG[status] ?? {
      label: status,
      className: "bg-slate-100 text-slate-700 border border-slate-300",
    }
  );
};

const CustomerBookingListPage = () => {
  const [bookings, setBookings] = useState<BookingListPage[]>([]);
  const { getListBookingCustomer } = useBookingService();

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getListBookingCustomer();
        if (res.success) {
          setBookings(res.data ?? []);
        } else {
          toast.error(
            typeof res.message === "string"
              ? res.message
              : "Lấy danh sách đơn thất bại"
          );
        }
      } catch (e) {
        toast.error("Lỗi hệ thống, vui lòng thử lại sau.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full flex justify-center p-4">
      <motion.div {...fadeUp} className="space-y-4 w-full">
        <div>
          <h1 className="text-2xl font-semibold">Đơn đặt tour của bạn</h1>
          <p className="text-slate-500 text-sm">
            Theo dõi trạng thái thanh toán, xác nhận và chi tiết các đơn bạn đã
            đặt.
          </p>
        </div>

        <Card className="shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Mã đơn</TableHead>
                <TableHead className="w-[140px]">Ngày khởi hành</TableHead>
                <TableHead>Tên tour</TableHead>
                <TableHead className="w-[200px]">Trạng thái đơn</TableHead>
                <TableHead className="text-right w-[140px]">
                  Tổng tiền
                </TableHead>
                <TableHead className="text-right w-[120px]">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-sm text-slate-500"
                  >
                    Bạn chưa có đơn đặt tour nào.
                  </TableCell>
                </TableRow>
              )}

              {bookings.map((item) => {
                const config = getStatusConfig(item.status);

                return (
                  <TableRow
                    key={item.booking_id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {item.booking_id}
                    </TableCell>

                    <TableCell>
                      {item.travel_date ? formatDate(item.travel_date) : "-"}
                    </TableCell>

                    <TableCell className="line-clamp-2 max-w-[280px]">
                      {item.tour_name}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={`${config.className} text-[11px] px-3 py-1 rounded-full`}
                      >
                        {config.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-semibold text-blue-600">
                      {item.total_price.toLocaleString("vi-VN")} đ
                    </TableCell>

                    <TableCell className="text-right">
                      <Link href={`/dashboard/orders/${item.booking_id}`}>
                        <Button
                          size="sm"
                          className="text-xs px-3 bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          Xem chi tiết
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomerBookingListPage;
