"use client";

import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { TourRequest } from "@/types/tour";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
const inputClass =
  "bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

type Props = {
  dayIndex: number;
};

const TimeActivityEditor: React.FC<Props> = ({ dayIndex }) => {
  const { control, setValue, clearErrors } = useFormContext<TourRequest>();

  const name = `itinerary.${dayIndex}.activities` as const;

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Ensure luôn có ít nhất 1 activity row để zod ăn chắc
  useEffect(() => {
    if (!fields || fields.length === 0) {
      setValue(name, [{ time: "", text: "" }], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayIndex]);

  const addRow = () => {
    append({ time: "", text: "" });
    clearErrors(name);
  };

  const removeRow = (idx: number) => {
    if (fields.length <= 1) return;
    remove(idx);
  };

  return (
    <div className="space-y-3">
      <Label>Hoạt động theo khung giờ</Label>

      <div className="space-y-2">
        {fields.map((f, idx) => (
          <div
            key={f.id}
            className="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto] gap-2 items-start"
          >
            <FormField
              control={control}
              name={`itinerary.${dayIndex}.activities.${idx}.time` as const}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="time"
                      step={60}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`itinerary.${dayIndex}.activities.${idx}.text` as const}
              render={({ field }) => (
                <FormItem>
                  <Input
                    className={inputClass}
                    placeholder='Ví dụ: "Đón khách tại điểm hẹn"'
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      clearErrors(name);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => removeRow(idx)}
              disabled={fields.length <= 1}
              className="gap-2 sm:mt-0"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Thêm hoạt động
      </Button>

      {/* error tổng cho array activities (min 1) */}
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TimeActivityEditor;
