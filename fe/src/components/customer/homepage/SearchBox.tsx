"use client";
import React, { useState } from "react";
import { z } from "zod";
import { GoSearch } from "react-icons/go";
import { Button } from "@/components/ui/button";

// tạo schema Seatch để xác thực
const searchSchema = z
  .object({
    destination: z.string().min(1, "Vui lòng nhập địa điểm bạn muốn đi"),
    minBudget: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Number(val)),
        "Ngân sách tối thiểu phải là số"
      ),
    maxBudget: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Number(val)),
        "Ngân sách tối đa phải là số"
      ),
  })
  .refine(
    (data) => {
      if (data.minBudget && data.maxBudget) {
        return Number(data.minBudget) <= Number(data.maxBudget);
      }
      return true;
    },
    {
      message: "Ngân sách tối thiểu phải nhỏ hơn hoặc bằng ngân sách tối đa",
      path: ["maxBudget"],
    }
  );

const SearchBox = () => {
  const [destination, setDestination] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSearch = () => {
    const result = searchSchema.safeParse({
      destination,
      minBudget,
      maxBudget,
    });

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
    console.log("Dữ liệu hợp lệ:", result.data);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-x-4">
      <div className="flex w-full sm:w-[60%] flex-col justify-center items-center gap-y-3">
        {/* Nhập địa điểm */}
        <div className="flex w-full items-center rounded-[7px] bg-white/50 p-2 sm:p-3">
          <GoSearch className="text-gray-800 mr-2" />
          <input
            type="text"
            placeholder="Bạn muốn đi đâu?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-6 sm:h-7 md:h-8 w-full outline-none text-gray-950 placeholder-gray-800 bg-transparent text-sm sm:text-base"
          />
        </div>
        {errors.destination && (
          <p className="text-red-500 text-sm w-full text-left">
            {errors.destination}
          </p>
        )}

        {/* Ngân sách  */}
        <div className="bg-transparent w-full flex flex-col sm:flex-row sm:items-center items-stretch justify-between gap-3">
          <div className="flex w-full items-center rounded-[7px] bg-white/50 p-2 sm:p-3 sm:w-[40%]">
            <input
              type="text"
              placeholder="Ngân sách tối thiểu"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              className="h-6 sm:h-7 md:h-8 w-full outline-none text-gray-950 placeholder-gray-800 bg-transparent text-sm sm:text-base"
            />
          </div>
          <div className="flex w-full items-center rounded-[7px] bg-white/50 p-2 sm:p-3 sm:w-[40%]">
            <input
              type="text"
              placeholder="Ngân sách tối đa"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="h-6 sm:h-7 md:h-8 w-full outline-none text-gray-950 placeholder-gray-800 bg-transparent text-sm sm:text-base"
            />
          </div>

          <Button
            onClick={handleSearch}
            className="h-12 sm:h-12 md:h-14 bg-slate-300 w-[100%] sm:w-[20%] text-gray-800 hover:bg-slate-600 hover:text-gray-100"
          >
            Tìm kiếm
          </Button>
        </div>

        {/* Lỗi ngân sách nếu có */}
        {(errors.minBudget || errors.maxBudget) && (
          <p className="text-red-500 text-sm w-full text-left">
            {errors.minBudget || errors.maxBudget}
          </p>
        )}
      </div>

      <div className="bg-red-500">Khám phá 3D map</div>
    </div>
  );
};

export default SearchBox;
