"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TourCard from "@/components/agency/tour/TourCard";
import { TourListPageType } from "@/types/tour";
import { useTourService } from "@/services/tourService";

const TourListPage = () => {
  const { getListTour } = useTourService();
  const [tours, setTours] = useState<TourListPageType[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getListTour();
      console.log("API response: ", res);
      if (res && res.success && res.data) {
        setTours(res.data);
      } else {
        setTours([]);
      }
    };
    fetchData();
  }, []);
  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa tour này?")) {
      console.log("Đã xóa tour:", id);
    }
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

      {/* Grid danh sách tour */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {tours?.map((tour) => (
          <TourCard key={tour.tour_id} tour={tour} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default TourListPage;
