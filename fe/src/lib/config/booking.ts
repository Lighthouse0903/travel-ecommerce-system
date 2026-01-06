import { BookingStatus } from "@/types/booking";

export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Chờ đại lý xác nhận",
    className: "bg-amber-50 text-amber-800 border border-amber-200",
  },
  paid_waiting: {
    label: "Chờ thanh toán",
    className: "bg-sky-50 text-sky-800 border border-sky-200",
  },
  paid: {
    label: "Đã thanh toán",
    className: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  },
  rejected: {
    label: "Bị từ chối",
    className: "bg-rose-50 text-rose-800 border border-rose-200",
  },
};
