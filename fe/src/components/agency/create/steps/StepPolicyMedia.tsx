"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { TourRequest } from "@/types/tour";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, UploadCloud } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "@/components/common/Upload/FileUpload";

const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

type GalleryUploadProps = {
  value: File[];
  onChange: (files: File[]) => void;
};

const GalleryUpload: React.FC<GalleryUploadProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const previews = useMemo(() => {
    return (value || []).map((f) => ({
      key: fileKey(f),
      name: f.name,
      url: URL.createObjectURL(f),
    }));
  }, [value]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const pick = (files: FileList | null) => {
    if (!files) return;

    const picked = Array.from(files);
    const merged = [...(value || []), ...picked];

    const map = new Map<string, File>();
    merged.forEach((f) => map.set(fileKey(f), f));
    onChange(Array.from(map.values()));

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const clearAll = () => onChange([]);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label>Ảnh gallery (bắt buộc)</Label>
          <p className="text-xs text-muted-foreground">
            Chọn ít nhất 1 ảnh. Có thể chọn nhiều lần để thêm ảnh.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud className="w-4 h-4" />
            Chọn ảnh
          </Button>

          {value.length > 0 && (
            <Button
              type="button"
              variant="destructive"
              className="gap-2"
              onClick={clearAll}
            >
              <Trash2 className="w-4 h-4" />
              Xoá hết
            </Button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => pick(e.target.files)}
        />
      </div>

      {previews.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed p-4">
          <p className="text-sm text-red-500">
            Chưa có ảnh gallery (bắt buộc).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {previews.map((p, idx) => (
            <div
              key={p.key}
              className="relative overflow-hidden rounded-2xl border bg-muted/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.name}
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute top-2 right-2 rounded-md bg-black/60 p-1 text-white hover:bg-black/70"
                aria-label="remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StepPolicyMedia: React.FC = () => {
  const { control, watch, setValue, clearErrors } =
    useFormContext<TourRequest>();

  const thumbnail = watch("thumbnail");
  const images = (watch("images") || []) as File[];

  return (
    <div className="space-y-5">
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Chính sách</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="policy.deposit_percent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đặt cọc (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={field.value ?? 0}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value || 0));
                      clearErrors("policy.deposit_percent");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="policy.cancellation_fee"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Phí huỷ</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("policy.cancellation_fee");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="policy.refund_policy"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Chính sách hoàn tiền</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("policy.refund_policy");
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
          <CardTitle className="text-xl font-semibold">Hình ảnh</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div>
              <Label>Thumbnail (bắt buộc)</Label>
              <p className="text-xs text-muted-foreground">
                Ảnh đại diện hiển thị ngoài danh sách tour.
              </p>
            </div>

            <FileUpload
              value={(thumbnail ?? null) as File | null}
              onChange={(file) => {
                setValue("thumbnail", file ?? (undefined as unknown as File), {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                if (file) clearErrors("thumbnail");
              }}
            />

            <FormField
              control={control}
              name="thumbnail"
              render={() => (
                <FormItem className="hidden">
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="images"
            render={() => (
              <FormItem className="space-y-2">
                <FormControl>
                  <GalleryUpload
                    value={images}
                    onChange={(next) => {
                      setValue("images", next, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      if (next.length) clearErrors("images");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StepPolicyMedia;
