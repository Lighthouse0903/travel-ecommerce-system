"use client";

import React from "react";
import Image from "next/image";

import { formatPrice } from "@/utils/formatPrice";
import { BookingDetail } from "@/types/booking";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface Props {
  booking: BookingDetail;
}

const OrderSummaryCard: React.FC<Props> = ({ booking }) => {
  const adultBasePrice = Number(booking.adult_price || 0);
  const childBasePrice = Number(booking.children_price || 0);

  const adultFinalPrice = Number(booking.final_price_per_person?.adult || 0);
  const childFinalPrice = Number(booking.final_price_per_person?.children || 0);

  const discountPercent = Number(booking.discount || 0);
  const hasDiscount =
    Number.isFinite(discountPercent) &&
    discountPercent > 0 &&
    discountPercent < 100;

  const numAdults = booking.num_adults ?? 0;
  const numChildren = booking.num_children ?? 0;

  const adultBaseSubtotal = adultBasePrice * numAdults;
  const childBaseSubtotal = childBasePrice * numChildren;
  const adultFinalSubtotal = adultFinalPrice * numAdults;
  const childFinalSubtotal = childFinalPrice * numChildren;

  const totalBasePrice = adultBaseSubtotal + childBaseSubtotal;

  const computedFinalTotal =
    adultFinalSubtotal + childFinalSubtotal || totalBasePrice;

  const totalFinalPrice =
    Number(booking.total_price || 0) || computedFinalTotal;

  const discountAmount =
    hasDiscount && totalBasePrice > totalFinalPrice
      ? totalBasePrice - totalFinalPrice
      : 0;

  const thumbnail = booking.tour_image;
  const totalGuests = numAdults + numChildren;

  return (
    <Card className="bg-slate-50 rounded-xl shadow-sm border">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Tóm tắt đơn hàng</CardTitle>
        <CardDescription>
          Chi tiết đặt tour cho {totalGuests || 0} khách
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm text-gray-700">
        {/* thông tin tour */}
        <div className="flex flex-col md:flex-row items-start gap-4">
          <Link href={`/tour/${booking.tour_id}`}>
            <div className="w-full md:w-[260px] h-[180px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt={booking.tour_name ?? "Ảnh tour"}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover cursor-pointer"
                />
              )}
            </div>
          </Link>

          <div className="flex-1 space-y-1.5">
            <Link href={`/tour/${booking.tour_id}`}>
              {" "}
              <div className="font-semibold text-gray-900 text-sm sm:text-base cursor-pointer hover:underline">
                {booking.tour_name}
              </div>
            </Link>
            <div className="text-gray-600">
              Ngày khởi hành:{" "}
              <span className="font-medium">
                {booking.travel_date || "Chưa chọn ngày"}
              </span>
            </div>

            {booking.pickup_point && (
              <div className="text-gray-600">
                Điểm đón:{" "}
                <span className="font-medium">{booking.pickup_point}</span>
              </div>
            )}

            <Separator className="my-2" />

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Số người lớn</span>
                <span className="font-medium">{numAdults}</span>
              </div>
              <div className="flex justify-between">
                <span>Số trẻ em</span>
                <span className="font-medium">{numChildren}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Tổng số khách</span>
                <span>{totalGuests}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Chi tiết giá + khuyến mãi */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Chi tiết giá</span>
          </div>

          {/* Giá gốc + % khuyến mãi */}
          <div className="space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Giá gốc (trước khuyến mãi)</span>
              <span className={hasDiscount ? "line-through" : ""}>
                {formatPrice(totalBasePrice)}
              </span>
            </div>

            {hasDiscount && (
              <div className="flex justify-between text-gray-600">
                <span>Khuyến mãi áp dụng</span>
                <span className="font-medium text-green-600">
                  {discountPercent}%
                </span>
              </div>
            )}
          </div>

          <Separator className="my-1" />

          {/* Tổng giá người lớn / trẻ em sau khuyến mãi */}
          {numAdults > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Tổng giá người lớn</div>
                <div className="text-xs text-gray-500">
                  {numAdults} x {formatPrice(adultFinalPrice || adultBasePrice)}
                </div>
              </div>
              <div className="flex flex-col items-end">
                {hasDiscount && adultBasePrice > 0 && (
                  <span className="text-[11px] text-gray-400 line-through">
                    {formatPrice(adultBaseSubtotal)}
                  </span>
                )}
                <span className="font-medium">
                  {formatPrice(adultFinalSubtotal || adultBaseSubtotal)}
                </span>
              </div>
            </div>
          )}

          {numChildren > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Tổng giá trẻ em</div>
                <div className="text-xs text-gray-500">
                  {numChildren} x{" "}
                  {formatPrice(childFinalPrice || childBasePrice)}
                </div>
              </div>
              <div className="flex flex-col items-end">
                {hasDiscount && childBasePrice > 0 && (
                  <span className="text-[11px] text-gray-400 line-through">
                    {formatPrice(childBaseSubtotal)}
                  </span>
                )}
                <span className="font-medium">
                  {formatPrice(childFinalSubtotal || childBaseSubtotal)}
                </span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Thuế, giảm giá, tổng cộng */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Thuế &amp; Phí</span>
            <span>0&nbsp;đ</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Giảm giá (tiền)</span>
            <span>
              {hasDiscount && discountAmount > 0
                ? `- ${formatPrice(discountAmount)}`
                : "-0 đ"}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
          <span>Tổng cộng</span>
          <span className="text-blue-600">{formatPrice(totalFinalPrice)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
