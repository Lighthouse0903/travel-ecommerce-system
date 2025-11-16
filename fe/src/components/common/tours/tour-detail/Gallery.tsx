"use client";

import React, { useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag, Images } from "lucide-react";

interface GalleryProps {
  images: { img_id?: string | number; image: string }[];
  tour: {
    name: string;
    duration_days: number;
    start_location: string;
    end_location: string;
  };
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  hasDiscount: boolean;
}

const Gallery: React.FC<GalleryProps> = ({
  images,
  tour,
  activeIndex,
  setActiveIndex,
  hasDiscount,
}) => {
  useEffect(() => {
    if (!images?.length) return;
    if (activeIndex < 0 || activeIndex >= images.length) {
      setActiveIndex(0);
    }
  }, [images, activeIndex, setActiveIndex]);

  const cover = images?.[activeIndex]?.image ?? images?.[0]?.image ?? null;

  return (
    <section className="rounded-2xl overflow-hidden shadow-md bg-white">
      <div className="relative aspect-video bg-muted">
        {cover ? (
          <img
            loading="lazy"
            src={cover}
            alt={tour.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Images className="w-10 h-10" />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-red-600 text-white text-xs font-semibold shadow flex gap-1 items-center">
            <Tag className="w-3.5 h-3.5" />
            Giảm giá
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/45 to-transparent p-6">
          <h1 className="text-3xl font-bold text-white">{tour.name}</h1>
          <p className="text-white/90 mt-1">
            {tour.duration_days} ngày • {tour.start_location} →{" "}
            {tour.end_location}
          </p>
        </div>
      </div>

      {images?.length > 1 && (
        <ScrollArea className="w-full">
          <div className="flex gap-2 p-3">
            {images.map((img, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={(img.img_id ?? i).toString()}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(i);
                    }
                  }}
                  aria-pressed={isActive}
                  title={`Ảnh ${i + 1}`}
                  className={[
                    "relative h-20 w-32 overflow-hidden rounded-lg border transition outline-none",
                    isActive
                      ? "ring-2 ring-rose-500 border-rose-500"
                      : "border-gray-200 hover:border-rose-300 focus:ring-2 focus:ring-rose-400",
                  ].join(" ")}
                >
                  <img
                    loading="lazy"
                    src={img.image}
                    alt={`thumb-${i}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </section>
  );
};

export default Gallery;
