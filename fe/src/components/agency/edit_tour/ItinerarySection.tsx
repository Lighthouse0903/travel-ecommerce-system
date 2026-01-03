"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={addDay}>
            <Plus className="w-4 h-4 mr-1" /> Thêm ngày
          </Button>
        </div>

        {itineraryError ? (
          <p className="text-sm text-destructive">{itineraryError}</p>
        ) : null}

        <div className="space-y-6">
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
