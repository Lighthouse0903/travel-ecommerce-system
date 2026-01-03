"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

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

import { useBookingService } from "@/services/bookingService";
import { formatDate } from "@/utils/formatDate";
import { PaginationMeta } from "@/types/pagination";
import { usePagination } from "@/hooks/usePagination";
import PaginationCustom from "@/components/common/pagination/Pagination";

type AgencyBookingListItem = {
  booking_id: string;
  booking_date: string;
  travel_date: string;
  status: "pending" | "paid_waiting" | "paid" | "rejected" | string;
  tour_name: string;
  customer_name: string;
  customer_email?: string | null;
  total_price: string;
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ xác nhận",
    className: "bg-amber-100 text-amber-800 border border-amber-300",
  },
  paid_waiting: {
    label: "Chờ thanh toán",
    className: "bg-sky-100 text-sky-800 border border-sky-300",
  },
  paid: {
    label: "Đã thanh toán",
    className: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  },
  rejected: {
    label: "Đã từ chối",
    className: "bg-rose-100 text-rose-800 border border-rose-300",
  },
};

const getStatusConfig = (status?: string) => {
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

const shortCode = (id: string) => id?.slice(0, 8).toUpperCase();

const formatMoneyVND = (amount: string) => {
  const n = Number(amount);
  if (Number.isNaN(n)) return amount;
  return n.toLocaleString("vi-VN") + " đ";
};

const AgencyBookingListPage = () => {
  const [bookings, setBookings] = useState<AgencyBookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const { page, pageSize, setPage } = usePagination({
    defaultPageSize: 5,
    maxPageSize: 50,
  });
  const { getListBookingAgency } = useBookingService();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getListBookingAgency({ page, page_size: pageSize });
        if (!mounted) return;

        if (res.success) {
          setBookings((res.data ?? []) as AgencyBookingListItem[]);
          setMeta((res.meta as PaginationMeta) ?? null);
        } else {
          setBookings([]);
          setMeta(null);
          toast.error(
            typeof res.message === "string"
              ? res.message
              : "Lấy danh sách đơn thất bại"
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [getListBookingAgency, page, pageSize]);

  const pendingCount = useMemo(
    () => bookings.filter((b) => b.status === "pending").length,
    [bookings]
  );

  return (
    <div className="w-full flex justify-center p-4">
      <div className="space-y-4 w-full max-w-6xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Danh sách đơn đặt tour</h1>
            <p className="text-slate-500 text-sm">
              Theo dõi trạng thái đơn và truy cập chi tiết để xử lý xác nhận /
              từ chối hoặc hỗ trợ khách hàng.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 text-xs border bg-slate-50"
            >
              Tổng: {meta?.count ?? bookings.length}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 text-xs border bg-amber-50 text-amber-800 border-amber-200"
            >
              Pending: {pendingCount}
            </Badge>
          </div>
        </div>

        <Card className="shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">Mã đơn</TableHead>
                <TableHead className="w-[220px]">Khách hàng</TableHead>
                <TableHead className="w-[140px]">Ngày khởi hành</TableHead>
                <TableHead>Tên tour</TableHead>
                <TableHead className="w-[160px]">Trạng thái</TableHead>
                <TableHead className="text-right w-[160px]">
                  Tổng tiền
                </TableHead>
                <TableHead className="text-right w-[140px]">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-sm text-slate-500"
                  >
                    Đang tải danh sách booking...
                  </TableCell>
                </TableRow>
              )}

              {!loading && bookings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-sm text-slate-500"
                  >
                    Hiện chưa có đơn đặt tour nào.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                bookings.map((item) => {
                  const config = getStatusConfig(item.status);

                  return (
                    <TableRow
                      key={item.booking_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        #{shortCode(item.booking_id)}
                        <div className="text-[11px] text-slate-500">
                          {item.booking_date
                            ? formatDate(item.booking_date)
                            : ""}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">{item.customer_name}</div>
                        <div className="text-xs text-slate-500">
                          {item.customer_email || "—"}
                        </div>
                      </TableCell>

                      <TableCell>
                        {item.travel_date ? formatDate(item.travel_date) : "-"}
                      </TableCell>

                      <TableCell className="line-clamp-2 max-w-[340px]">
                        {item.tour_name}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${config.className} text-[11px] px-3 py-1 rounded-full`}
                        >
                          {config.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-semibold text-blue-600">
                        {formatMoneyVND(item.total_price)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="sm"
                          className="text-xs px-3 bg-[#2A5FAE] hover:bg-[#4B5FAA] text-white rounded-xl ring-2"
                        >
                          <Link
                            href={`/agency/dashboard/bookings/${item.booking_id}`}
                          >
                            Xem chi tiết
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Card>

        {meta?.total_pages && meta.total_pages > 1 && (
          <div className="w-full mt-6 flex justify-center">
            <PaginationCustom
              page={page}
              totalPages={meta.total_pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default AgencyBookingListPage;
