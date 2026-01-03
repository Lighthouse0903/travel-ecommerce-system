"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import TourCard from "@/components/agency/tour/TourCard";
import { TourListPageType } from "@/types/tour";
import { useTourService } from "@/services/tourService";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TourListSkeleton from "./TourListSkeleton";

const TourListPage = () => {
  const { getListTour, deleteTour } = useTourService();
  const [tours, setTours] = useState<TourListPageType[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      const res = await getListTour();
      if (!mounted) return;

      if (res && res.success && res.data) setTours(res.data);
      else setTours([]);

      setLoading(false);
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [getListTour]);

  const openDelete = (id: string) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId || deleting) return;

    setDeleting(true);
    const res = await deleteTour(deleteId);
    setDeleting(false);

    if (res?.success) {
      setTours((prev) =>
        prev ? prev.filter((t) => t.tour_id !== deleteId) : prev
      );
      toast.success("Đã xóa tour");
      setDeleteId(null);
      return;
    }

    toast.error(res?.message || "Xóa tour thất bại");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách tour của bạn</h1>
        <Link href="/agency/dashboard/tours/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tạo tour mới
          </Button>
        </Link>
      </div>

      {loading ? (
        <TourListSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {tours?.map((tour) => (
            <TourCard
              key={tour.tour_id}
              tour={tour}
              onDelete={(id) => openDelete(id)}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tour này?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không thể hoàn tác. Tour sẽ bị xóa khỏi danh sách của
              bạn.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TourListPage;
