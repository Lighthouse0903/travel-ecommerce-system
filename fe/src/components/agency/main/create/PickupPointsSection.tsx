"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";

const PickupPointsSection = () => {
  const { control, register } = useFormContext();

  // Dùng useFieldArray để quản lý mảng pickup_points
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pickup_points",
  });

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border p-3 rounded-lg bg-gray-50"
        >
          <div className="flex flex-col gap-1">
            <Label>Địa điểm</Label>
            <Input
              placeholder="VD: Hà Nội"
              {...register(`pickup_points.${index}.location` as const)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Địa chỉ</Label>
            <Input
              placeholder="VD: Melia Hotel"
              {...register(`pickup_points.${index}.address` as const)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Giờ đón</Label>
            <Input
              type="time"
              {...register(`pickup_points.${index}.time` as const)}
            />
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Xóa
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ time: "", address: "", location: "" })}
        className="flex items-center gap-2 mt-2"
      >
        <Plus size={16} />
        Thêm điểm đón
      </Button>
    </div>
  );
};

export default PickupPointsSection;
