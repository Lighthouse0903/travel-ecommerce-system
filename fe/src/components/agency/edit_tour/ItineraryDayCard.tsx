"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus } from "lucide-react";
import { EditTourFormValues } from "@/app/agency/dashboard/tours/[id]/edit/formSchema";

type Props = {
  dayIndex: number;
  onRemove: () => void;
  disableRemove?: boolean;
};

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

  // errors
  const titleErr = errors.itinerary?.[dayIndex]?.title?.message
    ? String(errors.itinerary?.[dayIndex]?.title?.message)
    : null;

  const activitiesErr = errors.itinerary?.[dayIndex]?.activities?.message
    ? String(errors.itinerary?.[dayIndex]?.activities?.message)
    : null;

  return (
    <div className="rounded-2xl border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Ngày {dayValue}</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={disableRemove}
          aria-label="Xóa ngày"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Tiêu đề ngày</Label>
        <Input
          placeholder="VD: Khởi hành - tham quan..."
          {...register(`itinerary.${dayIndex}.title` as const)}
        />
        {titleErr ? (
          <p className="text-sm text-destructive">{titleErr}</p>
        ) : null}
      </div>

      <Separator />

      {/* Activities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Hoạt động</h4>
            <p className="text-sm text-muted-foreground">Giờ HH:mm + mô tả</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addActivity}
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm hoạt động
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
                  errors.itinerary?.[dayIndex]?.activities?.[idx]?.time?.message
                )
              : null;

            const textErr = errors.itinerary?.[dayIndex]?.activities?.[idx]
              ?.text?.message
              ? String(
                  errors.itinerary?.[dayIndex]?.activities?.[idx]?.text?.message
                )
              : null;

            return (
              <div
                key={f.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2"
              >
                <div className="md:col-span-3 space-y-1">
                  <Input
                    placeholder="07:00"
                    {...register(
                      `itinerary.${dayIndex}.activities.${idx}.time` as const
                    )}
                  />
                  {timeErr ? (
                    <p className="text-xs text-destructive">{timeErr}</p>
                  ) : null}
                </div>

                <div className="md:col-span-8 space-y-1">
                  <Input
                    placeholder="Nội dung hoạt động..."
                    {...register(
                      `itinerary.${dayIndex}.activities.${idx}.text` as const
                    )}
                  />
                  {textErr ? (
                    <p className="text-xs text-destructive">{textErr}</p>
                  ) : null}
                </div>

                <div className="md:col-span-1 flex md:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeActivity(idx)}
                    disabled={actFA.fields.length <= 1}
                    aria-label="Xóa hoạt động"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Accommodation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Lưu trú (tuỳ chọn)</h4>
            <p className="text-sm text-muted-foreground">
              Khách sạn / địa chỉ ngủ lại
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleAccommodation}
          >
            {acc ? "Bỏ lưu trú" : "Thêm lưu trú"}
          </Button>
        </div>

        {acc ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tên khách sạn</Label>
              <Input
                {...register(
                  `itinerary.${dayIndex}.accommodation.hotel_name` as const
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Số sao</Label>
              <Input
                type="number"
                min={1}
                max={5}
                {...register(
                  `itinerary.${dayIndex}.accommodation.stars` as const,
                  {
                    valueAsNumber: true,
                  }
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Số đêm</Label>
              <Input
                type="number"
                min={1}
                {...register(
                  `itinerary.${dayIndex}.accommodation.nights` as const,
                  {
                    valueAsNumber: true,
                  }
                )}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Địa chỉ</Label>
              <Input
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
  );
};

export default ItineraryDayCard;
