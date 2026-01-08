"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TourCard from "@/components/agency/tour/TourCard";
import TourListSkeleton from "./TourListSkeleton";
import { TourListPageType } from "@/types/tour";
import { usePagination } from "@/hooks/usePagination";
import type { PaginationMeta } from "@/types/pagination";
import PaginationCustom from "@/components/common/pagination/Pagination";

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

const TourListPage = () => {
  const searchParams = useSearchParams();
  const { getListTour, deleteTour } = useTourService();

  // pagination
  const { page, pageSize, setPage } = usePagination({
    defaultPageSize: 6,
    maxPageSize: 50,
  });

  const [tours, setTours] = useState<TourListPageType[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  // delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const q = searchParams.get("q") || "";
  const destination = searchParams.get("destination") || "";
  const departureLocation = searchParams.get("departure_location") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const categories =
    searchParams.get("categories") || searchParams.get("category") || "";
  const region = searchParams.get("region") || "";

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const query: Record<string, string | number | undefined> = {
          page,
          page_size: pageSize,
        };

        const res = await getListTour(query);
        if (!mounted) return;

        if (res?.success && Array.isArray(res.data)) {
          setTours(res.data);
          setMeta((res.meta as PaginationMeta) ?? null);
        } else {
          setTours([]);
          setMeta(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [
    getListTour,
    page,
    pageSize,
    q,
    destination,
    departureLocation,
    minPrice,
    maxPrice,
    categories,
    region,
  ]);

  const openDelete = (id: string) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId || deleting) return;

    setDeleting(true);
    const res = await deleteTour(deleteId);
    setDeleting(false);

    if (res?.success) {
      setTours((prev) => prev.filter((t) => t.tour_id !== deleteId));
      toast.success("Đã xóa tour");
      setDeleteId(null);
      return;
    }

    toast.error(res?.message || "Xóa tour thất bại");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách tour của bạn</h1>
        <Link href="/agency/dashboard/tours/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tạo tour mới
          </Button>
        </Link>
      </div>

      {/* Body */}
      {loading ? (
        <TourListSkeleton />
      ) : tours.length === 0 ? (
        <div className="w-full py-10 text-center text-slate-600">
          <p className="mb-2 font-medium">Bạn chưa có tour nào.</p>
          <p className="text-sm">
            Hãy tạo tour mới hoặc thay đổi bộ lọc để xem kết quả khác.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard
                key={tour.tour_id}
                tour={tour}
                onDelete={(id) => openDelete(id)}
              />
            ))}
          </div>

          {meta?.total_pages && meta.total_pages > 1 && (
            <div className="w-full mt-10 flex justify-center">
              <PaginationCustom
                page={page}
                totalPages={meta.total_pages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Delete dialog */}
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
