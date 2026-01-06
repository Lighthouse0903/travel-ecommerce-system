"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EditTourFormValues } from "@/types/tour";

type Props = {
  dayIndex: number;
  onRemove: () => void;
  disableRemove?: boolean;
};

const inputClass =
  "bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

const ItineraryDayCard: React.FC<Props> = ({
  dayIndex,
  onRemove,
  disableRemove,
}) => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EditTourFormValues>();

  const dayValue = watch(`itinerary.${dayIndex}.day`) ?? dayIndex + 1;
  const acc = watch(`itinerary.${dayIndex}.accommodation`);

  const actFA = useFieldArray({
    control,
    name: `itinerary.${dayIndex}.activities`,
  });

  const addActivity = () => actFA.append({ time: "07:00", text: "" });
  const removeActivity = (idx: number) => actFA.remove(idx);

  const toggleAccommodation = () => {
    if (acc) {
      setValue(`itinerary.${dayIndex}.accommodation`, null, {
        shouldDirty: true,
      });
    } else {
      setValue(
        `itinerary.${dayIndex}.accommodation`,
        { hotel_name: "", stars: 3, nights: 1, address: "" },
        { shouldDirty: true }
      );
    }
  };

  const titleErr = errors.itinerary?.[dayIndex]?.title?.message
    ? String(errors.itinerary?.[dayIndex]?.title?.message)
    : null;

  const activitiesErr = errors.itinerary?.[dayIndex]?.activities?.message
    ? String(errors.itinerary?.[dayIndex]?.activities?.message)
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            Ngày {dayValue}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={disableRemove}
          aria-label="Xóa ngày"
          className="h-9 w-9"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tiêu đề ngày</Label>
          <Input
            className={inputClass}
            placeholder="VD: Khởi hành - tham quan..."
            {...register(`itinerary.${dayIndex}.title` as const)}
          />
          {titleErr ? (
            <p className="text-sm text-destructive">{titleErr}</p>
          ) : null}
        </div>

        <Separator className="bg-border/60" />

        {/* Activities */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-foreground">
                Hoạt động
              </h4>
              <p className="text-sm text-muted-foreground">Giờ HH:mm + mô tả</p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addActivity}
              className="shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm hoạt động
            </Button>
          </div>

          {activitiesErr ? (
            <p className="text-sm text-destructive">{activitiesErr}</p>
          ) : null}

          <div className="space-y-2">
            {actFA.fields.map((f, idx) => {
              const timeErr = errors.itinerary?.[dayIndex]?.activities?.[idx]
                ?.time?.message
                ? String(
                    errors.itinerary?.[dayIndex]?.activities?.[idx]?.time
                      ?.message
                  )
                : null;

              const textErr = errors.itinerary?.[dayIndex]?.activities?.[idx]
                ?.text?.message
                ? String(
                    errors.itinerary?.[dayIndex]?.activities?.[idx]?.text
                      ?.message
                  )
                : null;

              return (
                <div
                  key={f.id}
                  className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-start"
                >
                  <div className="space-y-1 md:col-span-3">
                    <Input
                      className={inputClass}
                      placeholder="07:00"
                      {...register(
                        `itinerary.${dayIndex}.activities.${idx}.time` as const
                      )}
                    />
                    {timeErr ? (
                      <p className="text-xs text-destructive">{timeErr}</p>
                    ) : null}
                  </div>

                  <div className="space-y-1 md:col-span-8">
                    <Input
                      className={inputClass}
                      placeholder="Nội dung hoạt động..."
                      {...register(
                        `itinerary.${dayIndex}.activities.${idx}.text` as const
                      )}
                    />
                    {textErr ? (
                      <p className="text-xs text-destructive">{textErr}</p>
                    ) : null}
                  </div>

                  <div className="flex md:col-span-1 md:justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeActivity(idx)}
                      disabled={actFA.fields.length <= 1}
                      aria-label="Xóa hoạt động"
                      className="h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Accommodation */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-foreground">
                Lưu trú (tuỳ chọn)
              </h4>
              <p className="text-sm text-muted-foreground">
                Khách sạn / địa chỉ ngủ lại
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleAccommodation}
              className="shrink-0"
            >
              {acc ? "Bỏ lưu trú" : "Thêm lưu trú"}
            </Button>
          </div>

          {acc ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tên khách sạn</Label>
                <Input
                  className={inputClass}
                  {...register(
                    `itinerary.${dayIndex}.accommodation.hotel_name` as const
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Số sao</Label>
                <Input
                  className={inputClass}
                  type="number"
                  min={1}
                  max={5}
                  {...register(
                    `itinerary.${dayIndex}.accommodation.stars` as const,
                    { valueAsNumber: true }
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Số đêm</Label>
                <Input
                  className={inputClass}
                  type="number"
                  min={1}
                  {...register(
                    `itinerary.${dayIndex}.accommodation.nights` as const,
                    { valueAsNumber: true }
                  )}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium">Địa chỉ</Label>
                <Input
                  className={inputClass}
                  {...register(
                    `itinerary.${dayIndex}.accommodation.address` as const
                  )}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Không có thông tin lưu trú.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDayCard;
