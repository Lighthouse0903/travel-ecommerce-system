"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterData {
  destination: string;
  departure_location: string;
  region?: number; // 1 | 2 | 3
  min_price?: number;
  max_price?: number;
  categories: string[];
}

const TourFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Options
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

  // Init from URL
  const initialCategories =
    (searchParams.get("categories") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean) ?? [];

  const initialMin = searchParams.get("min_price")
    ? Number(searchParams.get("min_price"))
    : undefined;
  const initialMax = searchParams.get("max_price")
    ? Number(searchParams.get("max_price"))
    : undefined;

  const initialBudget =
    BUDGET_OPTIONS.find(
      (opt) => opt.min_price === initialMin && opt.max_price === initialMax
    )?.value || "";

  const [data, setData] = useState<FilterData>({
    destination: searchParams.get("destination") || "",
    departure_location: searchParams.get("departure_location") || "",
    region: searchParams.get("region")
      ? Number(searchParams.get("region"))
      : undefined,
    min_price: initialMin,
    max_price: initialMax,
    categories: initialCategories,
  });

  const [selectedBudget, setSelectedBudget] = useState(initialBudget);

  const updateData = <K extends keyof FilterData>(
    key: K,
    value: FilterData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const params = new URLSearchParams();

    if (data.destination.trim())
      params.set("destination", data.destination.trim());
    if (data.departure_location.trim())
      params.set("departure_location", data.departure_location.trim());

    if (typeof data.min_price === "number")
      params.set("min_price", String(data.min_price));
    if (typeof data.max_price === "number")
      params.set("max_price", String(data.max_price));

    if (data.categories.length)
      params.set("categories", data.categories.join(","));
    if (typeof data.region === "number")
      params.set("region", String(data.region));

    router.push(
      params.toString() ? `${pathname}?${params.toString()}` : pathname
    );
  };

  const handleReset = () => {
    setSelectedBudget("");
    setData({
      destination: "",
      departure_location: "",
      region: undefined,
      min_price: undefined,
      max_price: undefined,
      categories: [],
    });
    router.push(pathname);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-slate-800">
        Bộ lọc tìm kiếm
      </h2>

      {/* Địa điểm */}
      <div className="bg-slate-50 p-4 rounded-xl border mb-4">
        <h3 className="text-sm font-semibold mb-3 text-slate-700">Địa điểm</h3>

        <input
          placeholder="Điểm đến..."
          value={data.destination}
          onChange={(e) => updateData("destination", e.target.value)}
          className="w-full mb-3 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
        />

        <input
          placeholder="Điểm khởi hành..."
          value={data.departure_location}
          onChange={(e) => updateData("departure_location", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
        />
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

        {/* Region */}
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

      <div className="flex gap-2">
        <Button
          className="w-full mt-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          onClick={handleSubmit}
        >
          Áp dụng
        </Button>

        <Button
          className="w-full mt-1 rounded-lg font-semibold"
          variant="outline"
          onClick={handleReset}
        >
          Xoá lọc
        </Button>
      </div>
    </div>
  );
};

export default TourFilter;
