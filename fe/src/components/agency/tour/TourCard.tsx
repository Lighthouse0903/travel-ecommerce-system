"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

import StarRating from "@/components/common/rating/StarRating";
import { TourListPageType, CATEGORY_MAP } from "@/types/tour";

interface TourCardProps {
  tour: TourListPageType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const TourCard: React.FC<TourCardProps> = ({
  tour,
  onEdit,
  onDelete,
  onView,
}) => {
  const rawPrice = Number(tour.adult_price ?? 0);
  const rawDiscount = Number(tour.discount ?? 0);
  const rawRating = Number(tour.rating ?? 0);

  const price = Number.isFinite(rawPrice) ? rawPrice : 0;
  const discount = Number.isFinite(rawDiscount) ? rawDiscount : 0;
  const rating = Number.isFinite(rawRating) ? rawRating : 0;

  const finalPrice = price > 0 ? Math.round(price * (1 - discount / 100)) : 0;

  const imageSrc =
    typeof tour.thumbnail_url === "string" && tour.thumbnail_url.trim() !== ""
      ? tour.thumbnail_url
      : "https://i.pinimg.com/1200x/6a/f1/ec/6af1ec6645410a41d5339508a83b86f9.jpg";

  return (
    <Card className="relative bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer">
      {/* Thumbnail */}
      <div className="relative h-44 sm:h-48">
        <Image
          src={imageSrc}
          alt={tour.name}
          fill
          className="object-cover"
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

        {/* Status badge */}
        <div className="absolute bottom-3 left-3 z-10">
          {tour.is_active ? (
            <div className="rounded-full bg-green-600/90 text-white text-xs font-semibold px-3 py-1 backdrop-blur">
              Đang bán
            </div>
          ) : (
            <div className="rounded-full bg-red-400/40 text-white text-xs font-semibold px-3 py-1 backdrop-blur">
              Tạm dừng
            </div>
          )}
        </div>

        {/* Menu hành động */}
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-100 bg-black/40 hover:bg-black/60"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/agency/dashboard/tours/${tour.tour_id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(tour.tour_id);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2 text-green-600" />
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/agency/dashboard/tours/${tour.tour_id}/edit`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(tour.tour_id);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2 text-blue-600" />
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(tour.tour_id);
                }}
                className="text-red-600 focus:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 relative flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 min-h-[56px] mb-3">
          {tour.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center text-sm">
          <StarRating stars={rating} />
          <span className="ml-1 text-xs text-slate-600">
            ({tour.reviews_count} đánh giá)
          </span>
        </div>

        <hr className="my-2" />

        <p className="text-xs text-slate-500 mb-2">
          {tour.departure_location} → {tour.destination} • {tour.duration_days}{" "}
          ngày
        </p>

        {/* Categories */}
        {tour.categories && tour.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tour.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
              >
                {CATEGORY_MAP[cat] ?? cat}
              </span>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-h-[64px]">
            <p className="text-xs text-slate-500">Giá từ</p>
            <p className="text-lg font-bold text-blue-600 leading-tight">
              {finalPrice.toLocaleString("vi-VN")} đ
            </p>

            <p className="text-sm text-gray-400 line-through h-[20px]">
              {price > 0 && discount > 0
                ? `${Math.round(price).toLocaleString("vi-VN")} đ`
                : ""}
            </p>
          </div>

          <Link href={`/agency/dashboard/tours/${tour.tour_id}`}>
            <button className="h-9 px-4 rounded-full bg-slate-600 text-white text-xs hover:bg-slate-700 transition whitespace-nowrap">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourCard;
