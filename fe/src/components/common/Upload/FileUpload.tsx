"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud } from "lucide-react";

interface FileUploadProps {
  label: string;
  type: "image" | "video";
  value?: File[];
  onChange: (files: File[]) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  type,
  value = [],
  onChange,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    onChange([...value, ...files]);
  };

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleClick = () => inputRef.current?.click();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    onChange([...value, ...files]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-gray-700 font-medium">{label}</Label>

      <input
        ref={inputRef}
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        multiple
        onChange={handleFileChange}
        hidden
      />

      <div
        className={`relative flex flex-col items-center justify-center w-full h-56 rounded-2xl cursor-pointer transition-all duration-200 border-2 border-dashed ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {value.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 p-3">
            <AnimatePresence>
              {value.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group w-28 h-28 rounded-xl overflow-hidden border bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(i);
                    }}
                    className="absolute top-1 right-1 z-10 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>

                  {type === "image" ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${i}`}
                      fill
                      className="object-fill" // 👈 ép vừa khung, có thể méo nhẹ
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-fill"
                      controls
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <UploadCloud size={40} className="mb-2 text-gray-400" />
            <p className="text-sm text-center">
              Kéo & thả hoặc nhấn để chọn {type === "image" ? "ảnh" : "video"}{" "}
              (nhiều file)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
