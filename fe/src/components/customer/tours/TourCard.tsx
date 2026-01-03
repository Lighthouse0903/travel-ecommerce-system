"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/common/rating/StarRating";
import { TourListPageType, CATEGORY_MAP } from "@/types/tour";

interface Props {
  tour: TourListPageType;
}

const TourCard: React.FC<Props> = ({ tour }) => {
  if (!tour) return null;

  const price = Number(tour.adult_price ?? 0);
  const discount = Number(tour.discount ?? 0);
  const rating = Number(tour.rating ?? 0);

  const finalPrice = price > 0 ? Math.round(price * (1 - discount / 100)) : 0;

  const imageSrc =
    typeof tour.thumbnail_url === "string" && tour.thumbnail_url.trim() !== ""
      ? tour.thumbnail_url
      : "https://i.pinimg.com/1200x/6a/f1/ec/6af1ec6645410a41d5339508a83b86f9.jpg";

  const days = Math.max(1, Number(tour.duration_days ?? 1));
  const nights = Math.max(0, days - 1);

  return (
    <Link
      href={`/tour/${tour.tour_id}`}
      className="group block bg-white rounded-xl border border-slate-200 ring-1 ring-slate-100 overflow-hidden transition hover:border-slate-300 hover:ring-slate-200"
    >
      {/* Image */}
      <div className="relative aspect-[16/9]">
        <Image
          src={imageSrc}
          alt={tour.name ?? "Tour"}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="500px"
        />

        {/* Badge giảm giá */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 rounded-full bg-black/55 text-white px-3 py-1 text-xs font-semibold backdrop-blur">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
              Giảm {Math.round(discount)}%
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 z-10">
          <div className="rounded-md bg-black/60 text-white text-xs px-2.5 py-1">
            {days} ngày {nights} đêm
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col min-h-[220px]">
        {/* Title */}
        <h3 className="text-base font-semibold text-slate-800 line-clamp-2 min-h-[48px] mb-2">
          {tour.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center text-sm mb-2">
          <StarRating stars={rating} />
          <span className="ml-1 text-xs text-slate-600">
            ({Number(tour.reviews_count ?? 0)} đánh giá)
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-3 line-clamp-1">
          {tour.departure_location ? `${tour.departure_location} → ` : ""}
          {tour.destination}
        </p>

        {/* Categories */}
        {tour.categories?.length ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {tour.categories.slice(0, 6).map((cat) => (
              <span
                key={cat}
                className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
              >
                {CATEGORY_MAP[cat] ?? cat}
              </span>
            ))}
            {tour.categories.length > 6 && (
              <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                +{tour.categories.length - 6}
              </span>
            )}
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3">
          {/* Giá*/}
          <div className="min-h-[64px]">
            <p className="text-xs text-slate-500">Giá từ</p>

            {finalPrice > 0 ? (
              <>
                <p className="text-lg font-bold text-blue-600 leading-tight">
                  {finalPrice.toLocaleString("vi-VN")} đ
                </p>

                <p className="text-sm text-gray-400 line-through h-[20px]">
                  {price > 0 && discount > 0
                    ? `${price.toLocaleString("vi-VN")} đ`
                    : ""}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-slate-800">Liên hệ</p>
            )}
          </div>

          {/* Button */}
          <div className="h-9 px-4 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center transition group-hover:bg-slate-700 whitespace-nowrap">
            Xem chi tiết
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
