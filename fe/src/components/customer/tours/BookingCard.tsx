"use client";

import { formatPrice } from "@/utils/formatPrice";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  price: number;
  originalPrice?: number;
  hasDiscount?: boolean;
  tourId: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  price,
  originalPrice,
  hasDiscount,
  tourId,
}) => {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [numPeople, setNumPeople] = useState(2);

  const handleBookClick = () => {
    if (!date) {
      alert("Vui lòng chọn ngày khởi hành");
      return;
    }

    // Đẩy sang trang checkout, truyền kèm dữ liệu
    router.push(
      `/checkout?tourId=${tourId}&date=${date}&numPeople=${numPeople}`
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 h-fit w-full">
      <div className="text-xs text-gray-500 mb-1">Giá từ</div>
      <div className="flex items-baseline gap-2 mb-4">
        <div className="text-2xl font-semibold text-gray-900">
          {formatPrice(price)}
        </div>
        {hasDiscount && originalPrice && (
          <div className="text-xs text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </div>
        )}
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <label className="block text-gray-500 mb-1">Ngày khởi hành</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-500 mb-1">Số khách</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={numPeople}
            onChange={(e) => setNumPeople(Number(e.target.value))}
          >
            <option value={1}>1 người</option>
            <option value={2}>2 người</option>
            <option value={3}>3 người</option>
            <option value={4}>4+ khách</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleBookClick}
        className="mt-4 w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium hover:opacity-90"
      >
        Đặt tour ngay
      </button>

      <button className="mt-2 w-full rounded-lg border py-2.5 text-sm font-medium hover:bg-gray-50">
        Kiểm tra tình trạng chỗ
      </button>

      <p className="mt-3 text-xs text-gray-500">
        Bạn chưa bị trừ tiền ngay. Chúng tôi sẽ liên hệ xác nhận trong thời gian
        sớm nhất.
      </p>
    </div>
  );
};

export default BookingCard;
