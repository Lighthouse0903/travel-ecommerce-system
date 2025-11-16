"use client";
import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DayItem from "./DayItem";
import { TourRequest, Itinerary as ItineraryType } from "@/types/tour";

interface ItineraryProps {}

const Itinerary: React.FC<ItineraryProps> = () => {
  // 👇 Gõ kiểu form
  const { control, watch, setValue } = useFormContext<TourRequest>();

  const {
    fields: days,
    append,
    remove,
  } = useFieldArray<TourRequest, "itinerary">({
    control,
    name: "itinerary",
  });

  const durationDays = watch("duration_days");

  const addDay = () => {
    const newDay: ItineraryType = {
      day: days.length + 1,
      title: "",
      activities: [""],
      accommodation: {
        hotel_name: "",
        stars: 0,
        nights: 0,
        address: "",
      },
    };

    append(newDay);
  };

  const removeDay = (index: number) => {
    if (days.length > 1) remove(index);
  };

  useEffect(() => {
    days.forEach((_, i) => {
      setValue(`itinerary.${i}.day`, i + 1, { shouldDirty: true });
    });
  }, [days, setValue]);

  useEffect(() => {
    const n = Number(durationDays) || 0;
    if (n <= 0) return;

    if (days.length < n) {
      const delta = n - days.length;
      for (let i = 0; i < delta; i++) {
        const newDay: ItineraryType = {
          day: days.length + i + 1,
          title: "",
          activities: [""],
          accommodation: {
            hotel_name: "",
            stars: 0,
            nights: 0,
            address: "",
          },
        };
        append(newDay);
      }
    }

    if (days.length > n) {
      for (let i = days.length - 1; i >= n; i--) remove(i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationDays]);

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Lịch trình chi tiết
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {days.map((day, index) => (
          <DayItem key={day.id} dayIndex={index} removeDay={removeDay} />
        ))}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={addDay}
            disabled={days.length >= (Number(durationDays) || 0)}
          >
            + Thêm ngày
          </Button>

          <p className="text-sm text-muted-foreground">
            Ngày hiện có: {days.length}/{Number(durationDays) || 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Itinerary;
