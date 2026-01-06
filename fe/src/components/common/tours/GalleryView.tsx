"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type GalleryImage = {
  key: string;
  image: string;
};

interface GalleryProps {
  thumbnail: string | null;
  images: { img_id?: string | number; image: string }[];
}

const GalleryView: React.FC<GalleryProps> = ({ thumbnail, images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const galleryImages: GalleryImage[] = useMemo(() => {
    const result: GalleryImage[] = [];

    if (thumbnail) {
      result.push({ key: "thumbnail", image: thumbnail });
    }

    images.forEach((img, i) => {
      if (!img?.image) return;
      result.push({
        key: img.img_id?.toString() ?? `img-${i}`,
        image: img.image,
      });
    });

    return result;
  }, [thumbnail, images]);

  useEffect(() => {
    if (!galleryImages.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((i) => Math.min(Math.max(i, 0), galleryImages.length - 1));
  }, [galleryImages.length]);

  const cover = galleryImages[activeIndex]?.image ?? null;

  return (
    <section className="rounded-xl overflow-hidden bg-section border shadow-md">
      <div className="relative aspect-[16/9] bg-muted">
        {cover ? (
          <Image
            src={cover}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 70vw"
            alt="Ảnh tour"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Images className="w-10 h-10" />
          </div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <ScrollArea className="w-full">
          <div className="flex gap-2 p-3">
            {galleryImages.map((img, i) => (
              <button
                key={img.key}
                onClick={() => setActiveIndex(i)}
                className={`relative h-20 w-32 overflow-hidden rounded-lg border transition ${
                  i === activeIndex
                    ? "ring-2 ring-red-500/50"
                    : "hover:border-blue-300"
                }`}
              >
                <Image
                  src={img.image}
                  fill
                  sizes="128px"
                  alt={`Ảnh ${i + 1}`}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </section>
  );
};

export default GalleryView;
