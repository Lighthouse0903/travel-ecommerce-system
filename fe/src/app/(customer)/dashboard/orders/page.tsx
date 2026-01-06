"use client";

import React from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatDate } from "@/utils/formatDate";
import { usePagination } from "@/hooks/usePagination";
import PaginationCustom from "@/components/common/pagination/Pagination";
import { BOOKING_STATUS_CONFIG } from "@/lib/config/booking";
import BookingTableSkeleton from "./BookingTableSkeleton";
import { useCustomerBookings } from "@/hooks/useBookingAction";

const CustomerBookingListPage = () => {
  const { page, pageSize, setPage } = usePagination({
    defaultPageSize: 9,
    maxPageSize: 50,
  });

  const { bookings, meta, loading } = useCustomerBookings({
    page,
    pageSize,
  });

  return (
    <div className="w-full p-4 space-y-4">
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-slate-900">
          Đơn đặt tour của bạn
        </h1>
        <p className="text-sm text-slate-600">
          Theo dõi trạng thái thanh toán, xác nhận và chi tiết các đơn bạn đã
          đặt.
        </p>
      </div>

      <Card className="bg-card border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[120px]">Mã đơn</TableHead>
              <TableHead className="w-[140px]">Ngày khởi hành</TableHead>
              <TableHead>Tên tour</TableHead>
              <TableHead className="w-[200px]">Trạng thái đơn</TableHead>
              <TableHead className="text-right w-[140px]">Tổng tiền</TableHead>
              <TableHead className="text-right w-[120px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && <BookingTableSkeleton rows={5} />}

            {!loading && bookings.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-sm text-slate-500"
                >
                  Bạn chưa có đơn đặt tour nào.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              bookings.map((item) => {
                const config = BOOKING_STATUS_CONFIG[item.status];

                return (
                  <TableRow
                    key={item.booking_id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-900">
                      {item.booking_id.slice(0, 8).toUpperCase()}
                    </TableCell>

                    <TableCell className="text-slate-700">
                      {item.travel_date ? formatDate(item.travel_date) : "-"}
                    </TableCell>

                    <TableCell className="text-slate-700 line-clamp-2 max-w-[280px]">
                      {item.tour_name}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={`${config.className} text-[11px] px-3 py-1 rounded-full`}
                      >
                        {config.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-semibold text-primary">
                      {Number(item.total_price).toLocaleString("vi-VN")} đ
                    </TableCell>

                    <TableCell className="text-right">
                      <Link href={`/dashboard/orders/${item.booking_id}`}>
                        <Button size="sm" className="rounded-xl">
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

      {meta?.total_pages && meta.total_pages > 1 && (
        <div className="w-full pt-2 flex justify-center">
          <PaginationCustom
            page={page}
            totalPages={meta.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerBookingListPage;
