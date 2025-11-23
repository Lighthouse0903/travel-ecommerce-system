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
  const cleanPrice = Number(tour.adult_price ?? 0);
  const discount = Number(tour.discount ?? 0);
  const finalPrice =
    cleanPrice && !Number.isNaN(cleanPrice)
      ? cleanPrice * (1 - (discount || 0) / 100)
      : 0;

  const imageSrc = tour.image_url;

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

        {/* Badge giảm giá giống public */}
        {discount > 0 && (
          <div className="absolute w-10 h-10 top-3 left-3 rounded-full bg-red-500 text-white flex items-center justify-center">
            <span className="text-xs font-semibold">-{discount}%</span>
          </div>
        )}

        {/* Menu hành động của agency */}
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
              <Link href={`/agency/dashboard/tours/${tour.tour_id}`}>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(tour.tour_id);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2 text-green-600" /> Xem chi tiết
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(tour.tour_id);
                }}
              >
                <Pencil className="w-4 h-4 mr-2 text-blue-600" /> Sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(tour.tour_id);
                }}
                className="text-red-600 focus:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content giống public TourCard */}
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 mb-3 truncate">
          {tour.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center text-sm">
          <StarRating stars={tour.rating} />
          <span className="ml-1 text-xs text-slate-600">
            ({tour.reviews_count} đánh giá)
          </span>
        </div>

        <hr className="my-2" />

        <p className="text-xs text-slate-500 mb-1">{tour.destination}</p>

        {/* Categories giống public */}
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

        {/* Bottom: Giá + nút xem chi tiết (link đến trang agency) */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-slate-500">Giá từ</p>
            <p className="text-lg font-bold text-blue-600">
              {finalPrice.toLocaleString("vi-VN")} đ
            </p>
            {cleanPrice > 0 && discount > 0 && (
              <p className="text-md font-thin text-gray-400 line-through">
                {cleanPrice.toLocaleString("vi-VN")} đ
              </p>
            )}
          </div>

          <Link href={`/agency/dashboard/tours/${tour.tour_id}`}>
            <button className="px-4 py-2 rounded-full bg-slate-800 text-white text-xs hover:bg-slate-700 transition">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourCard;
