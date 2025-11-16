"use client";

import React, { useEffect, useState } from "react";
import { useTourService } from "@/services/tourService";
import { TourResponse } from "@/types/tour";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import CustomerInfor from "./CustomerInfor";
import OrderSummaryCard from "./OrderSummaryCard";

const CheckOut = () => {
  const { idOrSlug } = useParams();
  const searchParams = useSearchParams();
  const [tour, setTour] = useState<TourResponse | null>(null);
  const { getDetailPublicTour } = useTourService();
  const { user, access, loading } = useAuth();
  const [note, setNote] = useState("");

  const travelDate = searchParams.get("date");
  const numPeople = Number(searchParams.get("numPeople") ?? 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDetailPublicTour(idOrSlug as string);
        setTour((res?.data ?? null) as TourResponse);
      } catch (e) {
        console.log("Lỗi khi lấy chi tiết tour:", e);
      }
    };
    if (idOrSlug) fetchData();
  }, [idOrSlug]);

  if (loading || !tour) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        Đang tải dữ liệu...
      </div>
    );
  }
  // TODO: handleConfirm sẽ dùng access + note để gọi API booking + momo
  const handleConfirm = async () => {
    console.log("Chuẩn bị gọi API booking + momo với: ", {
      tourId: tour.tour_id,
      travelDate,
      numPeople,
      note,
      user,
      access,
    });
  };

  return (
    <div className="w-full flex justify-center items-center p-5">
      <div className="w-[95%] sm:w-[90%]">
        <h1 className="text-xl sm:text-3xl font-semibold mb-4">
          Xác nhận đặt tour &amp; Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Cột trái: tóm tắt đơn hàng */}
          <div className="lg:col-span-8 space-y-4">
            <OrderSummaryCard
              tour={tour}
              travelDate={travelDate}
              numPeople={numPeople}
              pickupPoint="Nhà hát lớn Hà Nội"
            />
          </div>

          {/* Cột phải: thông tin người đặt */}
          <div className="lg:col-span-4">
            <CustomerInfor user={user} />

            {/* Nút thanh toán tạm để đây */}
            <button
              onClick={handleConfirm}
              className="w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium hover:opacity-90"
            >
              Thanh toán với MoMo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
