"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { BookingDetail, BookingStatus } from "@/types/booking";
import { useBookingService } from "@/services/bookingService";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatMoneyVND } from "@/utils/formatPrice";

interface Props {
  booking: BookingDetail;
}

const AgencyBookingActionsCard = ({ booking }: Props) => {
  const { updateStatusBooking } = useBookingService();

  const [localStatus, setLocalStatus] = useState<BookingStatus>(booking.status);
  const [loading, setLoading] = useState(false);

  // confirm approve
  const [approveOpen, setApproveOpen] = useState(false);

  // reject
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    setLocalStatus(booking.status);
  }, [booking.status]);

  const money = useMemo(
    () => formatMoneyVND(booking.total_price),
    [booking.total_price]
  );

  const canApprove = localStatus === "pending";
  const canReject = localStatus === "pending";

  // chấp nhận
  const confirmApprove = async () => {
    if (!canApprove) return;

    setLoading(true);
    try {
      const res = await updateStatusBooking(booking.booking_id, "paid_waiting");

      if (!res?.success) {
        toast.error(
          typeof res?.message === "string"
            ? res.message
            : "Xác nhận đơn thất bại."
        );
        return;
      }

      toast.success("Đã xác nhận đơn, chuyển sang chờ thanh toán.");
      setLocalStatus("paid_waiting");
      setApproveOpen(false);

      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Lỗi hệ thống, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Từ chối đơn hàng
  const confirmReject = async () => {
    if (!canReject) return;

    const reason = rejectReason.trim();
    if (reason.length < 3) {
      toast.error("Vui lòng nhập lý do từ chối (tối thiểu 3 ký tự).");
      return;
    }

    setLoading(true);
    try {
      const res = await updateStatusBooking(
        booking.booking_id,
        "rejected",
        reason
      );

      if (!res?.success) {
        toast.error(
          typeof res?.message === "string"
            ? res.message
            : "Từ chối đơn thất bại."
        );
        return;
      }

      toast.success("Đã từ chối đơn đặt tour.");
      setLocalStatus("rejected");
      setRejectOpen(false);

      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Lỗi hệ thống, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-5 space-y-4">
        <div className="font-semibold">Xử lý đơn hàng</div>

        <div className="flex items-end justify-between">
          <div className="text-sm text-muted-foreground">Tổng tiền</div>
          <div className="text-2xl font-semibold">{money}</div>
        </div>

        {localStatus === "pending" && (
          <div className="space-y-2">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex gap-2">
              <Clock className="h-4 w-4 mt-0.5" />
              <div>
                Đơn hàng đang <b>chờ xác nhận</b>. Bạn có thể duyệt hoặc từ chối
                đơn này.
              </div>
            </div>

            <Button
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
              onClick={() => setApproveOpen(true)}
              disabled={loading}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Xác nhận đơn
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={() => {
                setRejectReason("");
                setRejectOpen(true);
              }}
              disabled={loading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối đơn
            </Button>
          </div>
        )}

        {localStatus === "paid_waiting" && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800 flex gap-2">
            <Clock className="h-4 w-4 mt-0.5" />
            <div>
              Đơn đã được <b>xác nhận</b> và đang <b>chờ khách thanh toán</b>.
              <div className="text-xs mt-1 opacity-80">
                (Không thể từ chối ở trạng thái này.)
              </div>
            </div>
          </div>
        )}

        {localStatus === "paid" && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 flex gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5" />
            <div>Đơn hàng đã được thanh toán.</div>
          </div>
        )}

        {localStatus === "rejected" && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 space-y-2">
            <div className="flex gap-2">
              <XCircle className="h-4 w-4 mt-0.5" />
              <div>
                Bạn đã <b>từ chối</b> đơn hàng này.
              </div>
            </div>

            <div className="text-sm text-rose-800/90">
              <span className="font-medium">Lý do:</span>{" "}
              {booking.rejected_reason?.trim() || "—"}
            </div>
          </div>
        )}
      </Card>

      {/* Diaglog Approved */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đơn đặt tour</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-slate-600">
            Bạn có chắc chắn muốn <b>xác nhận</b> đơn hàng này không?
            <br />
            Sau khi xác nhận, đơn sẽ chuyển sang trạng thái{" "}
            <b>chờ khách thanh toán</b>.
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={confirmApprove}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diaglog reject*/}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối đơn đặt tour</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              className="min-h-[120px]"
              disabled={loading}
            />
            <div className="text-xs text-slate-500">
              Lý do sẽ được gửi cho khách hàng.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={confirmReject}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AgencyBookingActionsCard;
