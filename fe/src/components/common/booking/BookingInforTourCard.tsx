"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import type { BookingDetail } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  booking: BookingDetail;
}

const CATEGORY_LABEL: Record<string, string> = {
  sea: "Biển",
  mountain: "Núi",
  resort: "Nghỉ dưỡng",
  adventure: "Khám phá",
  cultural: "Văn hoá",
  history: "Lịch sử",
};
const BookingInforTourCard = ({ booking }: Props) => {
  return (
    <Card className="bg-card border border-border rounded-2xl shadow-sm p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="font-semibold text-foreground">Thông tin tour</div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-[120px] w-full overflow-hidden rounded-xl sm:h-[120px] sm:w-[180px] border border-border">
          <Image
            src={booking.thumbnail_url || "/images/placeholder.jpg"}
            alt={booking.tour_name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-2">
          <div className="text-lg font-semibold">{booking.tour_name}</div>

          <div className="flex flex-wrap gap-2">
            {(booking.categories || []).slice(0, 3).map((c) => (
              <Badge key={c} variant="secondary">
                {CATEGORY_LABEL[c]}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-foreground">
                Điểm khởi hành:
              </span>{" "}
              {booking.departure_location}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-foreground">
                Điểm đến:
              </span>{" "}
              {booking.destination}
            </div>
          </div>

          <Link
            className="inline-block text-sm font-medium text-blue-600 hover:underline"
            href={`/tour/${booking.tour_id}`}
          >
            Xem chi tiết tour
          </Link>
        </div>
      </div>
    </Card>
  );
};
export default BookingInforTourCard;
