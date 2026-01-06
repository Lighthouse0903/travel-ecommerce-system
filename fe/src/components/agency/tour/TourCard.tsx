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
import { formatMoney } from "@/utils/formatPrice";

interface TourCardProps {
  tour: TourListPageType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const FALLBACK_IMG =
  "https://i.pinimg.com/1200x/6a/f1/ec/6af1ec6645410a41d5339508a83b86f9.jpg";

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
  const discountRaw = Number.isFinite(rawDiscount) ? rawDiscount : 0;
  const discount = Math.min(Math.max(discountRaw, 0), 100);
  const rating = Number.isFinite(rawRating) ? rawRating : 0;
  const reviewsCount = Number(tour.reviews_count ?? 0);

  const finalPrice = price > 0 ? Math.round(price * (1 - discount / 100)) : 0;

  const imageSrc =
    typeof tour.thumbnail_url === "string" && tour.thumbnail_url.trim() !== ""
      ? tour.thumbnail_url
      : FALLBACK_IMG;

  const days = Math.max(1, Number(tour.duration_days ?? 1));
  const nights = Math.max(0, days - 1);

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9]">
        <Image
          src={imageSrc}
          alt={tour.name ?? "Tour"}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="500px"
        />

        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 rounded-full bg-foreground/60 text-white px-3 py-1 text-xs font-semibold backdrop-blur">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive" />
              Giảm {Math.round(discount)}%
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 z-10">
          <div className="rounded-md bg-foreground/60 text-white text-xs px-2.5 py-1 backdrop-blur">
            {days} ngày {nights} đêm
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          {tour.is_active ? (
            <div className="rounded-full bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1 backdrop-blur">
              Đang bán
            </div>
          ) : (
            <div className="rounded-full bg-destructive/70 text-white text-xs font-semibold px-3 py-1 backdrop-blur">
              Tạm dừng
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white bg-foreground/40 hover:bg-foreground/60"
                onClick={(e) => e.stopPropagation()}
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
                  <Eye className="w-4 h-4 mr-2 text-emerald-600" />
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/agency/dashboard/tours/${tour.tour_id}/edit`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(tour.tour_id);
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

      <CardContent className="p-4 relative flex flex-col min-h-[220px]">
        <Link
          href={`/agency/dashboard/tours/${tour.tour_id}`}
          onClick={() => onView?.(tour.tour_id)}
          className="block"
        >
          <h3 className="text-base font-semibold text-foreground line-clamp-2 min-h-[48px] mb-2">
            {tour.name}
          </h3>
        </Link>

        <div className="flex items-center text-sm mb-2">
          <StarRating stars={rating} />
          <span className="ml-1 text-xs text-muted-foreground">
            ({reviewsCount} đánh giá)
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {tour.departure_location ? `${tour.departure_location} → ` : ""}
          {tour.destination}
        </p>

        {tour.categories?.length ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {tour.categories.slice(0, 6).map((cat) => (
              <span
                key={cat}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground border border-border"
              >
                {CATEGORY_MAP[cat] ?? cat}
              </span>
            ))}

            {tour.categories.length > 6 && (
              <span className="text-xs px-2 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border">
                +{tour.categories.length - 6}
              </span>
            )}
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-h-[64px]">
            <p className="text-xs text-muted-foreground">Giá từ</p>

            {finalPrice > 0 ? (
              <>
                <p className="text-lg font-bold text-primary leading-tight">
                  {formatMoney(finalPrice)}
                </p>

                <p className="text-sm text-muted-foreground/70 line-through h-[20px]">
                  {price > 0 && discount > 0 ? formatMoney(price) : ""}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-foreground">Liên hệ</p>
            )}
          </div>

          <Link
            href={`/agency/dashboard/tours/${tour.tour_id}`}
            onClick={() => onView?.(tour.tour_id)}
            className="h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center transition-colors group-hover:bg-primary-hover whitespace-nowrap"
          >
            Xem chi tiết
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourCard;
