"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays } from "lucide-react";

export type RevenuePreset = "7d" | "30d" | "this_month" | "custom";
export type RevenueGroupBy = "day" | "week" | "month";

type Props = {
  preset: RevenuePreset;
  onChangePreset: (p: RevenuePreset) => void;

  groupBy: RevenueGroupBy;
  onChangeGroupBy: (g: RevenueGroupBy) => void;

  from: string;
  to: string;
  onChangeFrom: (v: string) => void;
  onChangeTo: (v: string) => void;

  onApply: () => void;
  loading?: boolean;
};

const RevenueFilterBar: React.FC<Props> = ({
  preset,
  onChangePreset,
  groupBy,
  onChangeGroupBy,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onApply,
  loading,
}) => {
  return (
    <Card className="p-4 bg-slate-50 shadow-md">
      <div className="space-y-4">
        {/* Row 1: Presets */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm">Khoảng</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant={preset === "7d" ? "default" : "outline"}
                onClick={() => onChangePreset("7d")}
                type="button"
              >
                7 ngày
              </Button>
              <Button
                size="sm"
                variant={preset === "30d" ? "default" : "outline"}
                onClick={() => onChangePreset("30d")}
                type="button"
              >
                30 ngày
              </Button>
              <Button
                size="sm"
                variant={preset === "this_month" ? "default" : "outline"}
                onClick={() => onChangePreset("this_month")}
                type="button"
              >
                Tháng này
              </Button>
              <Button
                size="sm"
                variant={preset === "custom" ? "default" : "outline"}
                onClick={() => onChangePreset("custom")}
                type="button"
              >
                Tuỳ chọn
              </Button>
            </div>
          </div>
        </div>

        {/* Row 2: Range + groupBy + apply */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          {/* From/To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Từ</div>
              <Input
                type="date"
                value={from}
                onChange={(e) => onChangeFrom(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Đến</div>
              <Input
                type="date"
                value={to}
                onChange={(e) => onChangeTo(e.target.value)}
              />
            </div>
          </div>

          {/* Group by */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Gom theo</div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={groupBy === "day" ? "default" : "outline"}
                onClick={() => onChangeGroupBy("day")}
                type="button"
              >
                Ngày
              </Button>
              <Button
                size="sm"
                variant={groupBy === "week" ? "default" : "outline"}
                onClick={() => onChangeGroupBy("week")}
                type="button"
              >
                Tuần
              </Button>
              <Button
                size="sm"
                variant={groupBy === "month" ? "default" : "outline"}
                onClick={() => onChangeGroupBy("month")}
                type="button"
              >
                Tháng
              </Button>
            </div>
          </div>

          {/* Apply */}
          <Button
            size="sm"
            className="h-10 px-5"
            onClick={onApply}
            disabled={loading}
            type="button"
          >
            {loading ? "Đang tải..." : "Áp dụng"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RevenueFilterBar;
