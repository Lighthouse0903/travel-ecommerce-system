"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const previewUrl = useMemo(() => {
    if (!value || !value.type?.startsWith("image/")) return null;
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center h-56 w-full cursor-pointer rounded-2xl border-2 border-dashed transition",
        value
          ? "border-muted bg-muted/30"
          : "border-muted-foreground/30 hover:bg-muted/40",
        className
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        hidden
        onChange={handleSelect}
      />

      {value ? (
        <>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-black"
          >
            <X size={14} />
          </button>

          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="rounded-xl object-contain"
            />
          ) : (
            <p className="text-sm text-muted-foreground px-4 text-center">
              {value.name}
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center text-muted-foreground">
          <UploadCloud size={40} className="mb-2" />
          <p className="text-sm text-center">Nhấn để tải ảnh / PDF</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
