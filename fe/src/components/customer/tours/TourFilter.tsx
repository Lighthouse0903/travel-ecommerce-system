"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterData {
  budget: string;
  region: string;
  category: string[];
  duration: string;
}

const TourFilter = () => {
  const [budget, setBudget] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [data, setData] = useState<FilterData>({
    budget: "",
    region: "",
    category: [],
    duration: "",
  });

  const updateData = <K extends keyof FilterData>(
    key: K,
    value: FilterData[K]
  ) => {
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

  const CATEGORIES = [
    { value: "sea", label: "Biển" },
    { value: "mountain", label: "Núi" },
    { value: "resort", label: "Nghỉ dưỡng" },
    { value: "adventure", label: "Khám phá" },
    { value: "cultural", label: "Văn hoá" },
    { value: "history", label: "Lịch sử" },
  ];

  const handleSubmit = () => {
    console.log("Filters Data:", data);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-slate-800">
        Bộ lọc tìm kiếm
      </h2>

      {/* Ngân sách */}
      <div className="bg-slate-50 mb-4 p-3 rounded-xl border border-slate-200">
        <h3 className="text-sm font-semibold mb-3 text-slate-700">Ngân sách</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {budgets.map((item) => (
            <Button
              key={item.value}
              type="button"
              variant="outline"
              onClick={() => {
                setBudget(item.value);
                updateData("budget", item.value);
              }}
              className={cn(
                "justify-start text-xs sm:text-sm rounded-lg border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
                budget === item.value &&
                  "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
              )}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Loại tour + Vùng miền */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Loại tour */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold mb-3 text-slate-700">
            Loại tour
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.value}
                className="flex items-center gap-2 cursor-pointer text-slate-700"
              >
                <Checkbox
                  checked={category.includes(cat.value)}
                  onCheckedChange={(checked) => {
                    let newCategories = [...category];
                    if (checked === true) {
                      if (!newCategories.includes(cat.value)) {
                        newCategories.push(cat.value);
                      }
                    } else {
                      newCategories = newCategories.filter(
                        (c) => c !== cat.value
                      );
                    }
                    setCategory(newCategories);
                    updateData("category", newCategories);
                  }}
                />
                <span>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Vùng miền */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold mb-3 text-slate-700">
            Vùng miền
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {["Miền Bắc", "Miền Trung", "Miền Nam"].map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer text-slate-700"
              >
                <Checkbox
                  checked={region === item}
                  onCheckedChange={(checked) => {
                    const value = checked === true ? item : "";
                    setRegion(value);
                    updateData("region", value);
                  }}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Số ngày muốn đi */}
      <div className="bg-slate-50 mb-4 p-3 rounded-xl border border-slate-200">
        <h3 className="text-sm font-semibold mb-3 text-slate-700">
          Số ngày muốn đi
        </h3>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {DURATIONS.map((d) => (
            <label
              key={d.id}
              className="flex items-center gap-2 cursor-pointer text-slate-700"
            >
              <Checkbox
                checked={duration === d.value}
                onCheckedChange={(checked) => {
                  const newValue = checked === true ? d.value : "";
                  setDuration(newValue);
                  updateData("duration", newValue);
                }}
              />
              <span>{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Áp dụng */}
      <Button
        type="button"
        variant="default"
        className="w-full mt-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm font-semibold text-white"
        onClick={handleSubmit}
      >
        Áp dụng
      </Button>
    </div>
  );
};

export default TourFilter;
