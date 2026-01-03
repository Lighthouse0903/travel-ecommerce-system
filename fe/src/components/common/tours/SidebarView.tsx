"use client";

import React from "react";
import type { TourResponse } from "@/types/tour";
import { Star, BusFront, TicketPercent } from "lucide-react";

type Props = {
  tour: TourResponse;
};

const formatVND = (v: unknown) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0 ₫";
  return n.toLocaleString("vi-VN") + " ₫";
};

const calcFinal = (price: unknown, discount: unknown) => {
  const p = Number(price);
  const d = Number(discount);
  if (!Number.isFinite(p)) return 0;
  if (!Number.isFinite(d) || d <= 0) return p;
  return Math.max(0, (p * (100 - d)) / 100);
};

const TourMetaPanel: React.FC<Props> = ({ tour }) => {
  const rating = Number(tour.rating ?? 0);
  const reviews = Number(tour.reviews_count ?? 0);

  const discount = Number(tour.discount ?? 0);
  const hasDiscount = Number.isFinite(discount) && discount > 0;

  const adultPrice = Number(tour.adult_price ?? 0);
  const childPrice = Number(tour.children_price ?? 0);

  const finalAdult = calcFinal(adultPrice, discount);
  const finalChild = calcFinal(childPrice, discount);

  const transportation = Array.isArray(tour.transportation)
    ? tour.transportation.filter(Boolean)
    : [];

  return (
    <div className="space-y-4">
      {/* PRICE */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <div className="flex items-center gap-2">
          <TicketPercent className="w-5 h-5" />
          <p className="font-semibold">Giá tour</p>
        </div>

        <div className="mt-3 space-y-3">
          {/* Adult */}
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm text-muted-foreground">Người lớn</div>
            <div className="text-right">
              {hasDiscount ? (
                <div className="space-y-1">
                  <div className="text-lg font-bold">
                    {formatVND(finalAdult)}
                  </div>
                  <div className="text-xs text-muted-foreground line-through">
                    {formatVND(adultPrice)}
                  </div>
                </div>
              ) : (
                <div className="text-lg font-bold">{formatVND(adultPrice)}</div>
              )}
            </div>
          </div>

          {/* Child */}
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm text-muted-foreground">Trẻ em</div>
            <div className="text-right">
              {hasDiscount ? (
                <div className="space-y-1">
                  <div className="text-lg font-bold">
                    {formatVND(finalChild)}
                  </div>
                  <div className="text-xs text-muted-foreground line-through">
                    {formatVND(childPrice)}
                  </div>
                </div>
              ) : (
                <div className="text-lg font-bold">{formatVND(childPrice)}</div>
              )}
            </div>
          </div>

          {hasDiscount ? (
            <div className="pt-2 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Giảm giá</span>
              <span className="font-medium">{discount}%</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          <p className="font-semibold">Đánh giá</p>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">
              {Number.isFinite(rating) ? rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-sm text-muted-foreground">/ 5.0</span>
          </div>

          <span className="text-sm text-muted-foreground">
            {Number.isFinite(reviews) ? reviews : 0} lượt đánh giá
          </span>
        </div>
      </div>

      {/* Transportation */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <div className="flex items-center gap-2">
          <BusFront className="w-5 h-5" />
          <p className="font-semibold">Phương tiện</p>
        </div>

        <div className="mt-3 space-y-2">
          {transportation.length ? (
            <ul className="space-y-2">
              {transportation.map((t, idx) => (
                <li
                  key={`${t}-${idx}`}
                  className="text-sm text-gray-700 flex items-start gap-2"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa cập nhật phương tiện.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourMetaPanel;
