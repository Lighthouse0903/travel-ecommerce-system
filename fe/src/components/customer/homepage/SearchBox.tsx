"use client";
import React, { useState } from "react";
import { z } from "zod";
import { GoSearch } from "react-icons/go";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCoins } from "react-icons/fa6";
import { FaRegCalendarDays } from "react-icons/fa6";
import { SlLocationPin } from "react-icons/sl";

// tạo schema Seatch để xác thực
const searchSchema = z.object({
  destination: z.string().min(1, "Vui lòng nhập địa điểm bạn muốn đi"),
  budget: z.string().optional(),
  days: z.string().optional(),
});

const SearchBox = () => {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSearch = () => {
    const result = searchSchema.safeParse({
      destination,
      budget,
      days,
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
      <div className="flex w-full sm:w-[60%] flex-col justify-center items-center gap-y-3 bg-red">
        {/* Nhập địa điểm */}
        <div className="flex w-full items-center rounded-[7px] bg-white/50 p-2 sm:p-3">
          <SlLocationPin className="text-gray-800 mr-2" />
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
            <Select onValueChange={(value) => setBudget(value)}>
              <SelectTrigger className="w-full flex justify-start items-center border-none h-6 sm:h-7 md:h-8 placeholder-slate-950 ">
                <FaCoins className="mr-2" />
                <SelectValue
                  placeholder="Ngân sách của bạn ?"
                  className="text-gray-800 data-[placeholder]:text-gray-900"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under_5m">Dưới 5 triệu</SelectItem>
                <SelectItem value="5_10m">Từ 5 - 10 triệu</SelectItem>
                <SelectItem value="10_20m">Từ 10 - 20 triệu</SelectItem>
                <SelectItem value="over_20m">Trên 20 triệu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full items-center rounded-[7px] bg-white/50 p-2 sm:p-3 sm:w-[40%]">
            <Select onValueChange={(value) => setDays(value)}>
              <SelectTrigger className="w-full flex justify-start items-center border-none h-6 sm:h-7 md:h-8 ">
                <FaRegCalendarDays className="mr-2" />
                <SelectValue
                  placeholder="Bạn muốn đi mấy ngày ?"
                  className="text-gray-800 data-[placeholder]:text-gray-500"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 ngày</SelectItem>
                <SelectItem value="2">2 ngày 1 đêm</SelectItem>
                <SelectItem value="3">3 ngày 2 đêm</SelectItem>
                <SelectItem value="4">4 ngày 3 đêm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full items-center rounded-[7px] bg-white/50 sm:w-[18%]">
            <Button
              onClick={handleSearch}
              className="h-12 sm:h-12 md:h-14 bg-slate-300 w-[100%] text-gray-800 hover:bg-slate-600 hover:text-gray-100"
            >
              <GoSearch className="" />
              <p className="inline sm:hidden xl:inline">Tìm kiếm</p>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-slate-500">Khám phá 3D map</div>
    </div>
  );
};

export default SearchBox;
