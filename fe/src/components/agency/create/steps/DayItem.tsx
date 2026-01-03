"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { TourRequest } from "@/types/tour";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import TimeActivityEditor from "./TimeActivityEditor";

type Props = {
  index: number;
  onRemove: () => void;
  disableRemove?: boolean;
};

const DayItem: React.FC<Props> = ({ index, onRemove, disableRemove }) => {
  const { control, register, watch, setValue, clearErrors } =
    useFormContext<TourRequest>();

  // Ensure day luôn đúng (1-based) khi add/remove ngày
  useEffect(() => {
    setValue(`itinerary.${index}.day` as const, index + 1, {
      shouldDirty: true,
      shouldValidate: false,
    });
  }, [index, setValue]);

  const accommodation = watch(`itinerary.${index}.accommodation` as const);
  const hasAccommodation =
    accommodation !== null && accommodation !== undefined;

  const toggleAccommodation = (checked: boolean) => {
    if (checked) {
      setValue(
        `itinerary.${index}.accommodation` as const,
        { hotel_name: "", stars: 0, nights: 0, address: "" },
        { shouldDirty: true, shouldValidate: true }
      );
    } else {
      setValue(`itinerary.${index}.accommodation` as const, null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="p-4 border rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Ngày {index + 1}</h3>

        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={onRemove}
          disabled={disableRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <FormField
        control={control}
        name={`itinerary.${index}.title` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tiêu đề</FormLabel>
            <FormControl>
              <Input
                placeholder="VD: Hà Nội - Hạ Long"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  clearErrors(`itinerary.${index}.title` as const);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Activities editor */}
      <TimeActivityEditor dayIndex={index} />

      <div className="flex items-center gap-2">
        <Checkbox
          checked={hasAccommodation}
          onCheckedChange={(v) => toggleAccommodation(Boolean(v))}
        />
        <span className="text-sm">Có chỗ ở (tuỳ chọn)</span>
      </div>

      {hasAccommodation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Tên khách sạn</Label>
            <Input
              {...register(
                `itinerary.${index}.accommodation.hotel_name` as const
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Địa chỉ</Label>
            <Input
              {...register(`itinerary.${index}.accommodation.address` as const)}
            />
          </div>

          <div className="space-y-2">
            <Label>Số sao</Label>
            <Input
              type="number"
              min={0}
              {...register(`itinerary.${index}.accommodation.stars` as const, {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Số đêm</Label>
            <Input
              type="number"
              min={0}
              {...register(`itinerary.${index}.accommodation.nights` as const, {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DayItem;
