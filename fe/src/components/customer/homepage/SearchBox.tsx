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
        className="w-full max-w-2xl flex flex-col gap-2"
      >
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-white/60 rounded-full shadow-xl px-4 py-2 sm:px-6 sm:py-3">
          <SlLocationPin className="text-gray-600 text-lg shrink-0" />

          <input
            type="text"
            placeholder="Bạn muốn đi đâu?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-900 placeholder-gray-500"
          />

          <Button
            type="submit"
            className="rounded-full p-2 sm:p-3 min-w-[40px] min-h-[40px] flex items-center justify-center shadow-md hover:shadow-lg transition-all"
          >
            <GoSearch className="text-lg sm:text-xl" />
          </Button>
        </div>

        {errors.destination && (
          <p className="text-red-500 text-xs sm:text-sm mt-1 pl-2">
            {errors.destination}
          </p>
        )}
      </form>
    </div>
  );
};

export default SearchBox;
