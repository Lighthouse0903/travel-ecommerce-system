"use client";

import React from "react";
import Image from "next/image";
import { TourResponse } from "@/types/tour";
import { formatPrice } from "@/utils/formatPrice";

interface Props {
  tour: TourResponse;
  travelDate?: string | null;
  numPeople: number;
  pickupPoint?: string | null;
}

const OrderSummaryCard: React.FC<Props> = ({
  tour,
  travelDate,
  numPeople,
  pickupPoint,
}) => {
  // Giá người lớn & % giảm
  const adultPrice = Number(tour.adult_price || 0);
  const discountPercent = Number(tour.discount || 0);
  const hasDiscount =
    Number.isFinite(discountPercent) &&
    discountPercent > 0 &&
    discountPercent < 100;

  // Đơn giá sau giảm
  const unitPrice = hasDiscount
    ? adultPrice * (1 - discountPercent / 100)
    : adultPrice;

  const quantity = numPeople || 1;
  const totalBasePrice = adultPrice * quantity; // tổng giá gốc
  const totalPrice = unitPrice * quantity; // tổng giá sau giảm
  const discountAmount = hasDiscount ? totalBasePrice - totalPrice : 0;

  const firstImage =
    typeof tour.image_urls?.[0] === "string"
      ? tour.image_urls[0]
      : (tour.image_urls?.[0] as any)?.image;

  return (
    <section className="bg-white p-5 rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

      {/* Tour summary */}
      <div className="flex items-start gap-4">
        <div className="w-[300px] h-[200px] rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          {firstImage && (
            <Image
              src={firstImage}
              alt={tour.name ?? "Ảnh tour"}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col text-sm">
          <div className="font-semibold text-gray-900">{tour.name}</div>

          <div className="text-gray-600 mt-1">
            Ngày khởi hành:{" "}
            <span className="font-medium">
              {travelDate || "Chưa chọn ngày"}
            </span>
          </div>

          {pickupPoint && (
            <div className="text-gray-600 mt-0.5">
              Điểm đón: <span className="font-medium">{pickupPoint}</span>
            </div>
          )}

          <div className="text-gray-600 mt-0.5">
            Số khách: <span className="font-medium">{quantity} khách</span>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Chi tiết giá */}
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between items-center">
          <span>Giá tour ({quantity} khách)</span>

          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(totalBasePrice)}
              </span>
            )}
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div className="flex justify-between">
          <span>Thuế &amp; Phí</span>
          <span>0 đ</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Giảm giá</span>
          <span>
            {hasDiscount ? `- ${formatPrice(discountAmount)}` : "-0 đ"}
          </span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
        <span>Tổng cộng</span>
        <span className="text-blue-600">{formatPrice(totalPrice)}</span>
      </div>
    </section>
  );
};

export default OrderSummaryCard;
