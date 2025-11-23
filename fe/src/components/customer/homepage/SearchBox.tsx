"use client";

import React, { useState } from "react";
import { z } from "zod";
import { SlLocationPin } from "react-icons/sl";
import { GoSearch } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const searchSchema = z.object({
  destination: z.string().min(1, "Vui lòng nhập địa điểm bạn muốn đi"),
});

const SearchBox = () => {
  const [destination, setDestination] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = searchSchema.safeParse({ destination });

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path?.[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const query = new URLSearchParams({
      destination: destination.trim(),
    }).toString();

    router.push(`/tours?${query}`);
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[85%] flex flex-col gap-2"
      >
        <div className="flex flex-col sm:flex-row items-stretch bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-white/60 px-3 py-2 sm:px-4 sm:py-3 gap-2 sm:gap-3">
          <div className="flex flex-1 items-center gap-2">
            <SlLocationPin className="text-gray-700 shrink-0" />
            <input
              type="text"
              placeholder="Bạn muốn đi đâu?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-900 placeholder-gray-500"
            />
          </div>

          <Button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm sm:text-base font-medium"
          >
            <GoSearch className="text-base sm:text-lg" />
            <span>Tìm kiếm</span>
          </Button>
        </div>

        {errors.destination && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">
            {errors.destination}
          </p>
        )}
      </form>
    </div>
  );
};

export default SearchBox;
