"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { BedDouble, Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { TourRequest } from "@/types/tour";

interface DayItemProps {
  dayIndex: number;
  removeDay: (index: number) => void;
}

const DayItem = ({ dayIndex, removeDay }: DayItemProps) => {
  const { control, register } = useFormContext<TourRequest>();

  const {
    fields: activities,
    append: addActivity,
    remove: removeActivity,
  } = useFieldArray({
    // ✨ cast nhẹ cho đỡ bị constrain bởi TourRequest
    control: control as any,
    name: `itinerary.${dayIndex}.activities` as any,
  });

  return (
    <div className="p-4 border rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Ngày {dayIndex + 1}</h3>
        <Button
          variant="destructive"
          size="icon"
          type="button"
          onClick={() => removeDay(dayIndex)}
          aria-label="Xoá ngày"
          title="Xoá ngày"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <Label>Tiêu đề</Label>
        <Input
          {...register(`itinerary.${dayIndex}.title` as const)}
          placeholder="VD: Hà Nội - Hạ Long"
        />
      </div>

      {/* Activities */}
      <div>
        <Label>Hoạt động</Label>
        <div className="space-y-2">
          {activities.map((activity, actIndex) => (
            <div key={activity.id} className="flex gap-2">
              <Input
                {...register(
                  `itinerary.${dayIndex}.activities.${actIndex}` as const
                )}
                placeholder={`Hoạt động ${actIndex + 1}`}
              />
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => {
                  if (activities.length > 1) removeActivity(actIndex);
                }}
                aria-label="Xoá hoạt động"
                title="Xoá hoạt động"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => addActivity("")}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Thêm hoạt động
          </Button>
        </div>
      </div>

      {/* Accommodation */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="mt-2 w-full">
            <BedDouble className="mr-2 h-4 w-4" /> Thông tin chỗ ở (tuỳ chọn)
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 grid gap-3">
          <div>
            <Label>Tên khách sạn</Label>
            <Input
              {...register(
                `itinerary.${dayIndex}.accommodation.hotel_name` as const
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Số sao</Label>
              <Input
                type="number"
                {...register(
                  `itinerary.${dayIndex}.accommodation.stars` as const,
                  { valueAsNumber: true }
                )}
              />
            </div>
            <div>
              <Label>Số đêm</Label>
              <Input
                type="number"
                {...register(
                  `itinerary.${dayIndex}.accommodation.nights` as const,
                  { valueAsNumber: true }
                )}
              />
            </div>
            <div>
              <Label>Địa chỉ</Label>
              <Input
                {...register(
                  `itinerary.${dayIndex}.accommodation.address` as const
                )}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DayItem;
