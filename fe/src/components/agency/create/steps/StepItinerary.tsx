"use client";

import { useEffect, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { TourRequest, Itinerary as ItineraryType } from "@/types/tour";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DayItem from "./DayItem";

const makeEmptyDay = (dayNum: number): ItineraryType => ({
  day: dayNum,
  title: "",
  activities: [{ time: "", text: "" }],
  accommodation: null,
});

const StepItinerary: React.FC = () => {
  const { control, watch, setValue, clearErrors } =
    useFormContext<TourRequest>();

  const durationDays = Number(watch("duration_days") || 0);

  const { fields, append, remove } = useFieldArray<TourRequest, "itinerary">({
    control,
    name: "itinerary",
  });

  const safeDuration = useMemo(() => {
    if (!Number.isFinite(durationDays) || durationDays <= 0) return 0;
    return Math.floor(durationDays);
  }, [durationDays]);

  useEffect(() => {
    if (!safeDuration) return;

    const currentLen = fields.length;

    if (currentLen < safeDuration) {
      for (let i = currentLen; i < safeDuration; i++) {
        append(makeEmptyDay(i + 1));
      }
      clearErrors("itinerary");
    }

    if (currentLen > safeDuration) {
      for (let i = currentLen - 1; i >= safeDuration; i--) {
        remove(i);
      }
      clearErrors("itinerary");
    }
  }, [safeDuration, fields.length, append, remove, clearErrors]);

  useEffect(() => {
    if (!fields.length) return;
    fields.forEach((_, idx) => {
      setValue(`itinerary.${idx}.day`, idx + 1, { shouldDirty: true });
    });
  }, [fields.length, setValue, fields]);

  const addDay = () => {
    const next = (safeDuration || fields.length || 0) + 1;
    setValue("duration_days", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeDay = (idx: number) => {
    if (fields.length <= 1) return;

    const next = Math.max(1, fields.length - 1);
    remove(idx);
    setValue("duration_days", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors("itinerary");
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Lịch trình</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((f, idx) => (
          <DayItem
            key={f.id}
            index={idx}
            onRemove={() => removeDay(idx)}
            disableRemove={fields.length <= 1}
          />
        ))}

        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={addDay}>
            + Thêm ngày
          </Button>

          <p className="text-sm text-muted-foreground">
            {fields.length}/{safeDuration || fields.length} ngày
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepItinerary;
