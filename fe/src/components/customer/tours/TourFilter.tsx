"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  PlaneTakeoff,
  Wallet,
} from "lucide-react";

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
  const BUDGET_OPTIONS = useMemo(
    () => [
      {
        label: "Tất cả mức giá",
        value: "",
        min_price: undefined,
        max_price: undefined,
      },
      {
        label: "Dưới 5 triệu/người",
        value: "under_5",
        min_price: 0,
        max_price: 50000000,
      },
      { label: "5-10 triệu/người", value: "5_10", min_price: 5, max_price: 10 },
      {
        label: "10-20 triệu/người",
        value: "10_20",
        min_price: 10000000,
        max_price: 20000000,
      },
      {
        label: "Trên 20 triệu/người",
        value: "over_20",
        min_price: 20000000,
        max_price: undefined,
      },
    ],
    []
  );

  const CATEGORIES = useMemo(
    () => [
      { value: "sea", label: "Du lịch Biển" },
      { value: "mountain", label: "Núi rừng & Leo núi" },
      { value: "resort", label: "Nghỉ dưỡng" },
      { value: "adventure", label: "Khám phá & Mạo hiểm" },
      { value: "cultural", label: "Văn hoá" },
      { value: "history", label: "Lịch sử" },
    ],
    []
  );

  const REGIONS = useMemo(
    () => [
      { label: "Miền Bắc", value: 1 },
      { label: "Miền Trung", value: 2 },
      { label: "Miền Nam", value: 3 },
    ],
    []
  );

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
    <div className="w-full rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-200">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            Bộ lọc tìm kiếm
          </h2>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <RotateCcw className="h-4 w-4" />
          Đặt lại
        </button>
      </div>

      {/* Điểm đến */}
      <div className="space-y-2 mb-4">
        <div className="text-sm font-semibold text-slate-900">Điểm đến</div>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            placeholder="Bạn muốn đi đâu?"
            value={data.destination}
            onChange={(e) => updateData("destination", e.target.value)}
            className="w-full rounded-2xl bg-sky-100/60 px-11 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Điểm khởi hành */}
      <div className="space-y-2 mb-4">
        <div className="text-sm font-semibold text-slate-900">
          Điểm khởi hành
        </div>
        <div className="relative">
          <PlaneTakeoff className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            placeholder="Ví dụ: Hà Nội"
            value={data.departure_location}
            onChange={(e) => updateData("departure_location", e.target.value)}
            className="w-full rounded-2xl bg-sky-100/60 px-11 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Ngân sách */}
      <div className="space-y-2 mb-4">
        <div className="text-sm font-semibold text-slate-900">Ngân sách</div>
        <div className="relative">
          <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <select
            value={selectedBudget}
            onChange={(e) => {
              const opt = BUDGET_OPTIONS.find(
                (o) => o.value === e.target.value
              );
              setSelectedBudget(e.target.value);
              updateData("min_price", opt?.min_price);
              updateData("max_price", opt?.max_price);
            }}
            className="w-full appearance-none rounded-2xl bg-sky-100/60 px-11 py-3 text-sm text-slate-900 outline-none ring-1 ring-transparent focus:ring-blue-300"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-slate-500">
          *Đơn vị ngân sách theo triệu VND.
        </p>
      </div>

      {/* Loại hình trải nghiệm (checkbox đơn giản như bro muốn) */}
      <div className="mb-4">
        <div className="mb-2 text-sm font-semibold text-slate-900">
          Loại hình trải nghiệm
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const checked = data.categories.includes(cat.value);

              return (
                <label
                  key={cat.value}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => {
                      const isChecked = v === true;
                      const updated = isChecked
                        ? Array.from(new Set([...data.categories, cat.value]))
                        : data.categories.filter((c) => c !== cat.value);
                      updateData("categories", updated);
                    }}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <span className="text-sm text-slate-800">{cat.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vùng miền (giữ lại theo code cũ, style cho đồng bộ) */}
      <div className="mb-4">
        <div className="mb-2 text-sm font-semibold text-slate-900">
          Vùng miền
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <div className="space-y-1">
            {REGIONS.map((r) => {
              const checked = data.region === r.value;

              return (
                <label
                  key={r.value}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) =>
                      updateData("region", v === true ? r.value : undefined)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <span className="text-sm text-slate-800">{r.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Apply */}
      <Button
        onClick={handleSubmit}
        className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        Áp dụng
      </Button>
    </div>
  );
};

export default TourFilter;
