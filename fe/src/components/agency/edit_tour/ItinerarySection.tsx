"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Section from "./Section";
import ItineraryDayCard from "./ItineraryDayCard";
import { EditTourFormValues } from "@/types/tour";

const ItinerarySection: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EditTourFormValues>();

  const dayFA = useFieldArray({ control, name: "itinerary" });

  const addDay = () => {
    const nextDay = (dayFA.fields.length ?? 0) + 1;
    dayFA.append({
      day: nextDay,
      title: "",
      activities: [{ time: "07:00", text: "" }],
      accommodation: null,
    });
  };

  const removeDay = (idx: number) => {
    dayFA.remove(idx);

    // renumber day 1..n
    const cur = watch("itinerary") ?? [];
    cur.forEach((_, i) => {
      setValue(`itinerary.${i}.day`, i + 1, { shouldDirty: true });
    });
  };

  const itineraryError =
    typeof errors.itinerary?.message === "string"
      ? errors.itinerary.message
      : null;

  return (
    <Section
      title="Lịch trình"
      description="Thêm ngày, tiêu đề ngày và các hoạt động theo khung giờ."
      rightSlot={
        <Button type="button" variant="outline" onClick={addDay}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm ngày
        </Button>
      }
    >
      <div className="space-y-3">
        {itineraryError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {itineraryError}
          </div>
        ) : null}

        <div className="space-y-4">
          {dayFA.fields.map((f, dayIndex) => (
            <ItineraryDayCard
              key={f.id}
              dayIndex={dayIndex}
              disableRemove={dayFA.fields.length <= 1}
              onRemove={() => removeDay(dayIndex)}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ItinerarySection;
