"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as SliderPrimitive from "@radix-ui/react-slider";

const Slider = ({
  value,
  onValueChange,
}: {
  value: number[];
  onValueChange: (v: number[]) => void;
}) => (
  <SliderPrimitive.Root
    className="relative flex w-full items-center"
    value={value}
    max={15}
    min={1}
    step={1}
    onValueChange={onValueChange}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-slate-300">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-blue-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-blue-500 bg-white shadow" />
  </SliderPrimitive.Root>
);

interface FilterData {
  destination: string;
  region?: number;
  start_location: string;
  end_location: string;
  min_price?: number;
  max_price?: number;
  categories: string[];
  duration_days?: number;
}

const TourFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** ------- OPTIONS ------- */
  const BUDGET_OPTIONS = [
    { label: "Tất cả", value: "", min_price: undefined, max_price: undefined },
    {
      label: "Dưới 5 triệu/người",
      value: "under_5",
      min_price: 0,
      max_price: 5,
    },
    { label: "5-10 triệu/người", value: "5_10", min_price: 5, max_price: 10 },
    {
      label: "10-20 triệu/người",
      value: "10_20",
      min_price: 10,
      max_price: 20,
    },
    {
      label: "Trên 20 triệu/người",
      value: "over_20",
      min_price: 20,
      max_price: undefined,
    },
  ];

  const CATEGORIES = [
    { value: "sea", label: "Biển" },
    { value: "mountain", label: "Núi" },
    { value: "resort", label: "Nghỉ dưỡng" },
    { value: "adventure", label: "Khám phá" },
    { value: "cultural", label: "Văn hoá" },
    { value: "history", label: "Lịch sử" },
  ];

  const REGIONS = [
    { label: "Miền Bắc", value: 1 },
    { label: "Miền Trung", value: 2 },
    { label: "Miền Nam", value: 3 },
  ];

  /** lấy giá rị ban đầu qua searchParams */
  const initialCategories =
    (searchParams.get("categories") || "").split(",").filter(Boolean) ?? [];

  const initialBudget =
    BUDGET_OPTIONS.find(
      (opt) =>
        opt.min_price ==
          (searchParams.get("min_price")
            ? Number(searchParams.get("min_price"))
            : undefined) &&
        opt.max_price ==
          (searchParams.get("max_price")
            ? Number(searchParams.get("max_price"))
            : undefined)
    )?.value || "";

  const initialSlider = Number(searchParams.get("duration_days") || "3");

  const [data, setData] = useState<FilterData>({
    destination: searchParams.get("destination") || "",
    start_location: searchParams.get("start_location") || "",
    end_location: searchParams.get("end_location") || "",
    region: searchParams.get("region")
      ? Number(searchParams.get("region"))
      : undefined,
    min_price: searchParams.get("min_price")
      ? Number(searchParams.get("min_price"))
      : undefined,
    max_price: searchParams.get("max_price")
      ? Number(searchParams.get("max_price"))
      : undefined,
    duration_days: initialSlider,
    categories: initialCategories,
  });

  const [selectedBudget, setSelectedBudget] = useState(initialBudget);
  const [sliderValue, setSliderValue] = useState<number[]>([initialSlider]);

  const updateData = <K extends keyof FilterData>(
    key: K,
    value: FilterData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) return;
      if (Array.isArray(value) && value.length === 0) return;

      params.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(params.toString() ? `${pathname}?${params}` : pathname);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-slate-800">
        Bộ lọc tìm kiếm
      </h2>

      {/* Điểm đến */}
      <div className="bg-slate-50 p-4 rounded-xl border mb-4">
        <h3 className="text-sm font-semibold mb-3 text-slate-700">Địa điểm</h3>

        <input
          placeholder="Địa điểm chung..."
          value={data.destination}
          onChange={(e) => updateData("destination", e.target.value)}
          className="w-full mb-3 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Điểm khởi hành"
            value={data.start_location}
            onChange={(e) => updateData("start_location", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
          />
          <input
            placeholder="Điểm kết thúc"
            value={data.end_location}
            onChange={(e) => updateData("end_location", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* Ngân sách */}
      <div className="bg-slate-50 mb-4 p-3 rounded-xl border">
        <h3 className="text-sm font-semibold mb-3 text-slate-700">
          Ngân sách / người
        </h3>

        <select
          value={selectedBudget}
          onChange={(e) => {
            const opt = BUDGET_OPTIONS.find((o) => o.value === e.target.value);
            setSelectedBudget(e.target.value);
            updateData("min_price", opt?.min_price);
            updateData("max_price", opt?.max_price);
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Categories */}
        <div className="bg-slate-50 p-3 rounded-xl border">
          <h3 className="text-sm font-semibold mb-3 text-slate-700">
            Loại tour
          </h3>

          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2">
              <Checkbox
                checked={data.categories.includes(cat.value)}
                onCheckedChange={(checked) => {
                  const updated = checked
                    ? [...data.categories, cat.value]
                    : data.categories.filter((c) => c !== cat.value);
                  updateData("categories", updated);
                }}
                className="data-[state=checked]:bg-blue-500"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>

        {/* Vùng */}
        <div className="bg-slate-50 p-3 rounded-xl border">
          <h3 className="text-sm font-semibold mb-3 text-slate-700">
            Vùng miền
          </h3>

          {REGIONS.map((r) => (
            <label key={r.value} className="flex items-center gap-2">
              <Checkbox
                checked={data.region === r.value}
                onCheckedChange={(checked) =>
                  updateData("region", checked ? r.value : undefined)
                }
                className="data-[state=checked]:bg-blue-500"
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Số ngày */}
      <div className="bg-slate-50 mb-4 p-3 rounded-xl border">
        <h3 className="text-sm font-semibold mb-3 text-slate-700">
          Số ngày muốn đi
        </h3>

        <Slider
          value={sliderValue}
          onValueChange={(v) => {
            setSliderValue(v);
            updateData("duration_days", v[0]);
          }}
        />

        <p className="text-sm mt-2 text-slate-700">{sliderValue[0]} ngày</p>
      </div>

      <Button
        className="w-full mt-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        onClick={handleSubmit}
      >
        Áp dụng
      </Button>
    </div>
  );
};

export default TourFilter;
