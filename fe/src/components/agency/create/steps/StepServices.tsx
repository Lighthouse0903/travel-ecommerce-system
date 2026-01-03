"use client";

import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { TourRequest } from "@/types/tour";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type ListEditorProps = {
  label: string;
  value: string[];
  onAdd: (text: string) => void;
  onRemove: (idx: number) => void;
};

const ListEditor: React.FC<ListEditorProps> = ({
  label,
  value,
  onAdd,
  onRemove,
}) => {
  const [text, setText] = useState("");

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Nhập ${label.toLowerCase()}...`}
        />
        <Button
          type="button"
          onClick={() => {
            const v = text.trim();
            if (!v) return;
            onAdd(v);
            setText("");
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
        ) : (
          value.map((item, idx) => (
            <Badge
              key={`${item}-${idx}`}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <span className="text-sm">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="rounded hover:opacity-80"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};

const StepServices: React.FC = () => {
  const { control, setValue, clearErrors, register, getValues } =
    useFormContext<TourRequest>();

  // ✅ Quan trọng: register 3 field array để RHF "biết" field này tồn tại
  useEffect(() => {
    register("transportation");
    register("services_included");
    register("services_excluded");
  }, [register]);

  // ✅ useWatch ổn định hơn watch()
  const transportation = useWatch({ control, name: "transportation" }) ?? [];
  const servicesIncluded =
    useWatch({ control, name: "services_included" }) ?? [];
  const servicesExcluded =
    useWatch({ control, name: "services_excluded" }) ?? [];

  const addToList = (
    field: "transportation" | "services_included" | "services_excluded",
    text: string
  ) => {
    const v = text.trim();
    if (!v) return;

    const current = (getValues(field) ?? []) as string[];
    if (current.includes(v)) return;

    setValue(field, [...current, v], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearErrors(field);
  };

  const removeFromList = (
    field: "transportation" | "services_included" | "services_excluded",
    idx: number
  ) => {
    const current = (getValues(field) ?? []) as string[];

    setValue(
      field,
      current.filter((_, i) => i !== idx),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <div className="space-y-5">
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Giá tour</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="adult_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá người lớn</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value ?? 0}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value || 0));
                      clearErrors("adult_price");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="children_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá trẻ em</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value ?? 0}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value || 0));
                      clearErrors("children_price");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giảm giá (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={field.value ?? 0}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value || 0));
                      clearErrors("discount");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Dịch vụ</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <ListEditor
            label="Phương tiện di chuyển"
            value={transportation}
            onAdd={(t) => addToList("transportation", t)}
            onRemove={(idx) => removeFromList("transportation", idx)}
          />

          <ListEditor
            label="Dịch vụ bao gồm"
            value={servicesIncluded}
            onAdd={(t) => addToList("services_included", t)}
            onRemove={(idx) => removeFromList("services_included", idx)}
          />

          <ListEditor
            label="Dịch vụ không bao gồm"
            value={servicesExcluded}
            onAdd={(t) => addToList("services_excluded", t)}
            onRemove={(idx) => removeFromList("services_excluded", idx)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StepServices;
