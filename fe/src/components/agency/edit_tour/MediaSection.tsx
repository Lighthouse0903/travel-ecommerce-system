"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import Section from "./Section";
import { Button } from "@/components/ui/button";
import { Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditTourFormValues } from "@/app/agency/dashboard/tours/[id]/edit/formSchema";
import FileUpload from "@/components/common/Upload/FileUpload";

type PreviewTour = {
  thumbnail_url?: string | null;
  image_urls?: Array<{ img_id: number; image: string }>;
};

type Props = {
  tourPreview?: PreviewTour | null;
};

function GalleryPicker({
  value,
  onChange,
  className,
}: {
  value: File[];
  onChange: (files: File[]) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  useEffect(() => {
    objectUrls.forEach((u) => URL.revokeObjectURL(u));

    const urls = (value ?? []).map((f) => URL.createObjectURL(f));
    setObjectUrls(urls);

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.length]);

  const pick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    onChange(files);
  };

  const clear = () => {
    onChange([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "relative w-full rounded-2xl border-2 border-dashed p-4 transition",
          value?.length
            ? "border-muted bg-muted/30"
            : "border-muted-foreground/30 hover:bg-muted/40 cursor-pointer"
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={pick}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-5 w-5" />
            <div className="text-sm">
              <div className="font-medium text-foreground">
                {value?.length
                  ? `Đã chọn ${value.length} ảnh`
                  : "Chọn ảnh gallery"}
              </div>
              <div className="text-xs text-muted-foreground">
                Nhấn để chọn ảnh mới (ghi đè danh sách ảnh đang chọn)
              </div>
            </div>
          </div>

          {value?.length ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Bỏ chọn
            </Button>
          ) : null}
        </div>
      </div>

      {/* Preview grid */}
      {objectUrls.length ? (
        <div className="grid grid-cols-3 gap-2">
          {objectUrls.slice(0, 9).map((u, idx) => (
            <div
              key={u + idx}
              className="relative aspect-square overflow-hidden rounded-xl border"
            >
              <Image
                src={u}
                alt={`New gallery ${idx}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Chưa chọn ảnh mới (giữ ảnh hiện tại).
        </p>
      )}
    </div>
  );
}

const MediaSection: React.FC<Props> = ({ tourPreview }) => {
  const { setValue, watch } = useFormContext<EditTourFormValues>();

  const thumbnailFile = watch("thumbnail"); // File | undefined
  const galleryFiles = watch("images") ?? []; // File[]

  const currentThumbUrl = tourPreview?.thumbnail_url ?? null;
  const currentGallery = tourPreview?.image_urls ?? [];

  return (
    <Section
      title="Ảnh"
      description="Bạn có thể giữ ảnh cũ hoặc chọn ảnh mới để thay thế."
    >
      <div className="space-y-8 overflow-hidden">
        {/* THumbnail */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium">Thumbnail</h3>
            <p className="text-sm text-muted-foreground">
              Ảnh đại diện hiển thị ở danh sách tour.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border p-4 space-y-2">
              <p className="text-sm font-medium">Ảnh hiện tại</p>
              {currentThumbUrl ? (
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl border">
                  <Image
                    src={currentThumbUrl}
                    alt="Current thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa có thumbnail.
                </p>
              )}
            </div>

            {/* New (FileUpload component) */}
            <div className="rounded-2xl border p-4 space-y-2">
              <p className="text-sm font-medium">Ảnh mới (nếu chọn)</p>

              <FileUpload
                value={thumbnailFile ?? null}
                onChange={(file) =>
                  setValue("thumbnail", file ?? undefined, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium">Gallery</h3>
            <p className="text-sm text-muted-foreground">
              Bộ ảnh chi tiết tour (có thể chọn lại để cập nhật).
            </p>
          </div>

          {/* Current gallery */}
          <div className="rounded-2xl border p-4 space-y-2">
            <p className="text-sm font-medium">Ảnh hiện tại</p>
            {currentGallery.length ? (
              <div className="grid grid-cols-3 gap-2">
                {currentGallery.slice(0, 9).map((img) => (
                  <div
                    key={img.img_id}
                    className="relative aspect-square rounded-xl overflow-hidden border"
                  >
                    <Image
                      src={img.image}
                      alt={`Gallery ${img.img_id}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có gallery.</p>
            )}
          </div>

          {/* New gallery picker */}
          <div className="rounded-2xl border p-4 space-y-2">
            <p className="text-sm font-medium">Ảnh mới (nếu chọn)</p>

            <GalleryPicker
              value={galleryFiles}
              onChange={(files) =>
                setValue("images", files, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default MediaSection;
