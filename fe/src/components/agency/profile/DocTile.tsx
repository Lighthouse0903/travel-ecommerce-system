"use client";

import Image from "next/image";
import React from "react";
import { Eye, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  url?: string | null;
  className?: string;
}

const DocTile: React.FC<Props> = ({ title, url, className }) => {
  const has = Boolean(url);

  return (
    <div
      className={cn(
        // fixed height look + no weird wrapping
        "rounded-xl border bg-background p-3 min-w-0",
        "flex flex-col gap-3",
        className
      )}
    >
      {/* Preview luôn có (mobile cũng đẹp) */}
      <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
        <div className="relative aspect-[16/9] w-full">
          {has ? (
            <Image
              src={url!}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>

      {/* Text + action */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0">
          {/* clamp title để không bị dài quá */}
          <p className="text-sm font-semibold leading-snug line-clamp-2">
            {title}
          </p>

          {/*  ẩn url trên mobile cho sạch */}
          <p className="mt-1 text-xs text-muted-foreground hidden sm:block truncate">
            {has ? url : "Chưa có tài liệu"}
          </p>

          {/* mobile: show trạng thái ngắn gọn */}
          <div className="mt-2 sm:hidden">
            {has ? (
              <Badge variant="secondary">Đã có</Badge>
            ) : (
              <Badge variant="secondary">Thiếu</Badge>
            )}
          </div>
        </div>

        {has ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-2 h-9"
              >
                <Eye className="h-4 w-4" />
                Xem
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl z-[120]">
              <DialogHeader>
                <DialogTitle className="pr-8">{title}</DialogTitle>
              </DialogHeader>

              <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
                {/* ảnh lớn, giữ tỉ lệ */}
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={url!}
                    alt={title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 1100px"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Badge variant="secondary" className="shrink-0">
            Thiếu
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DocTile;
