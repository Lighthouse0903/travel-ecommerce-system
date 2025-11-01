"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { TOUR_CATEGORIES } from "@/lib/data/tourCategories";
import { Checkbox } from "@/components/ui/checkbox";
import { check } from "zod";

const TourFilter = () => {
  const [budget, setBudget] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [data, setData] = useState({
    budget: "",
    region: "",
    category: [] as string[],
    duration: "",
  });

  const updateData = (key: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const budgets = [
    { label: "Dưới 5 triệu", value: "under_5m" },
    { label: "Từ 5 - 10 triệu", value: "5_10m" },
    { label: "Từ 10 - 20 triệu", value: "10_20m" },
    { label: "Trên 20 triệu", value: "over_20m" },
  ];

  const DURATIONS = [
    { id: 1, label: "Dưới 3 ngày", value: "<3" },
    { id: 2, label: "3 đến 5 ngày", value: "3-5" },
    { id: 3, label: "5 đến 7 ngày", value: "5-7" },
    { id: 4, label: "Hơn 7 ngày", value: ">7" },
  ];

  const handleSubmit = () => {
    console.log("Filters Data:", data);
  };

  return (
    <div className="w-full bg-slate-100 rounded-xl p-3 mt-6">
      <h2 className="text-center text-xl font-bold">Bộ lọc tìm kiếm</h2>

      {/* Ngân sách */}
      <div className="bg-slate-50 mb-3 p-2 rounded-md">
        <h3 className="text-md font-semibold mb-3">Ngân sách</h3>
        <div className="grid grid-cols-2 gap-2">
          {budgets.map((item) => (
            <Button
              key={item.value}
              variant={budget === item.value ? "default" : "outline"}
              onClick={() => {
                setBudget(item.value);
                updateData("budget", item.value);
              }}
              className={cn(
                "text-sm",
                budget === item.value
                  ? "bg-slate-500 text-white hover:bg-slate-600"
                  : "bg-slate-100 border-slate-300 hover:bg-slate-100"
              )}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Loại tour */}
      <div className="bg-slate-50 mb-3 p-2 rounded-md">
        <h3 className="text-md font-semibold mb-3">Loại tour</h3>
        <div className="grid grid-cols-2 gap-2">
          {TOUR_CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={category.includes(cat.name)}
                onCheckedChange={(checked) => {
                  let newCategories = [...category];

                  if (checked) {
                    newCategories.push(cat.name);
                  } else {
                    newCategories = newCategories.filter((c) => c !== cat.name);
                  }

                  setCategory(newCategories);
                  updateData("category", newCategories);
                }}
              />

              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Vùng miền */}
      <div className="bg-slate-50 mb-3 p-2 rounded-md">
        <h3 className="text-md font-semibold mb-3">Vùng miền</h3>
        <div className="grid grid-cols-2 gap-2">
          {["Miền Bắc", "Miền Trung", "Miền Nam"].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <Checkbox
                checked={region === item}
                onCheckedChange={(checked) => {
                  const value = checked ? item : "";
                  setRegion(value);
                  updateData("region", value);
                }}
              />

              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Số ngày muốn đi */}
      <div className="bg-slate-50 mb-3 p-2 rounded-md">
        <h3 className="text-md font-semibold mb-3">Số ngày muốn đi</h3>
        <div className="grid grid-cols-2 gap-2">
          {DURATIONS.map((d) => (
            <label
              key={d.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={duration === d.value}
                onCheckedChange={(checked) => {
                  const newValue = checked ? d.value : "";
                  setDuration(newValue);
                  updateData("duration", newValue);
                }}
              />

              <span>{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Áp dung */}
      <div className="mb-3">
        <Button variant="default" className="w-full" onClick={handleSubmit}>
          Áp dụng
        </Button>
      </div>
    </div>
  );
};

export default TourFilter;
