"use client";
import React, { useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { cn } from "@/lib/utils";

const TRANSPORT_OPTIONS = [
  "Ô tô",
  "Máy bay",
  "Tàu cao tốc",
  "Thuyền",
  "Xe máy",
  "Xe đạp",
];

const QUICK_INCLUDED = [
  "Khách sạn 3* (2 người/phòng)",
  "Ăn sáng hàng ngày",
  "Vé tham quan theo chương trình",
  "Hướng dẫn viên địa phương",
];

const QUICK_EXCLUDED = [
  "Chi phí cá nhân",
  "Nước uống ngoài chương trình",
  "Thuế VAT",
  "Vé máy bay khứ hồi",
];

const ServicesAndPrice = () => {
  const { register, control, watch, setValue } = useFormContext();

  const selectedTransport: string[] = watch("transportation") || [];
  const toggleTransport = (v: string) => {
    const s = new Set(selectedTransport);
    s.has(v) ? s.delete(v) : s.add(v);
    setValue("transportation", Array.from(s), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const {
    fields: includedFields,
    append: addIncluded,
    remove: removeIncluded,
  } = useFieldArray({ control, name: "services_included" });

  // Tạo 1 dòng mặc định khi rỗng
  useEffect(() => {
    if (!includedFields || includedFields.length === 0) addIncluded("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    fields: excludedFields,
    append: addExcluded,
    remove: removeExcluded,
  } = useFieldArray({ control, name: "services_excluded" });

  useEffect(() => {
    if (!excludedFields || excludedFields.length === 0) addExcluded("");
  }, []);

  const addQuick = (items: string[], appendFn: (v: string) => void) => {
    items.forEach((t) => appendFn(t));
  };

  return (
    <div className="space-y-6">
      {/* Transportation */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Di chuyển</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Label>Chọn các phương tiện di chuyển:</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TRANSPORT_OPTIONS.map((option) => {
              const id = `transport_${option}`;
              const checked = selectedTransport.includes(option);
              return (
                <label
                  key={option}
                  htmlFor={id}
                  className={cn(
                    "flex items-center gap-2 rounded-md border p-2 cursor-pointer",
                    checked ? "border-primary" : "border-muted"
                  )}
                  title={option}
                >
                  <input
                    id={id}
                    type="checkbox"
                    className="accent-blue-600"
                    checked={checked}
                    onChange={() => toggleTransport(option)}
                    aria-label={option}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Included services */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Dịch vụ bao gồm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_INCLUDED.map((q) => (
              <Button
                key={q}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addIncluded(q)}
                title={`Thêm: ${q}`}
              >
                + {q}
              </Button>
            ))}
          </div>

          {includedFields.map((item, index) => (
            <div key={item.id} className="flex gap-2">
              <Input
                placeholder="VD: Ăn sáng, vé tham quan..."
                {...register(`services_included.${index}`)}
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => {
                  if (includedFields.length > 1) removeIncluded(index);
                }}
                aria-label="Xoá dịch vụ bao gồm"
                title="Xoá"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => addIncluded("")}
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm dịch vụ
          </Button>
        </CardContent>
      </Card>

      {/* Excluded services */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Dịch vụ không bao gồm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_EXCLUDED.map((q) => (
              <Button
                key={q}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addExcluded(q)}
                title={`Thêm: ${q}`}
              >
                + {q}
              </Button>
            ))}
          </div>

          {excludedFields.map((item, index) => (
            <div key={item.id} className="flex gap-2">
              <Input
                placeholder="VD: Chi phí cá nhân, vé máy bay..."
                {...register(`services_excluded.${index}`)}
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => {
                  if (excludedFields.length > 1) removeExcluded(index);
                }}
                aria-label="Xoá dịch vụ không bao gồm"
                title="Xoá"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => addExcluded("")}
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm dịch vụ
          </Button>
        </CardContent>
      </Card>

      {/* Guide */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Hướng dẫn viên</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Họ tên</Label>
            <Input
              placeholder="VD: Nguyễn Văn A"
              {...register("guide.name_guide")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Số điện thoại</Label>
            <Input
              placeholder="VD: 0912345678"
              {...register("guide.phone_guide", {
                // regex nhẹ, backend vẫn sẽ validate sâu hơn
                pattern: {
                  value: /^\+?\d{9,15}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Kinh nghiệm (năm)</Label>
            <Input
              type="number"
              min={0}
              placeholder="VD: 3"
              {...register("guide.experience_years", { valueAsNumber: true })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesAndPrice;
